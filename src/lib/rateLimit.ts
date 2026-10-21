import { NextResponse } from "next/server";

export interface RateLimitOptions {
  windowMs: number; // e.g. 60000 (1 minute)
  max: number; // Maximum allowed hits within windowMs
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

interface HitRecord {
  timestamps: number[];
}

// In-memory store for rate limiting with automated LRU cleanup
const store = new Map<string, HitRecord>();
const MAX_STORE_SIZE = 5000;
let lastCleanup = Date.now();

function cleanupExpired(now: number) {
  if (now - lastCleanup < 60000 && store.size < MAX_STORE_SIZE) return;
  lastCleanup = now;

  for (const [key, record] of store.entries()) {
    // Keep only timestamps younger than 1 hour
    record.timestamps = record.timestamps.filter((t) => now - t < 3600000);
    if (record.timestamps.length === 0) {
      store.delete(key);
    }
  }

  // If still above max size, prune oldest entries
  if (store.size > MAX_STORE_SIZE) {
    const keys = Array.from(store.keys());
    for (let i = 0; i < keys.length / 2; i++) {
      store.delete(keys[i]);
    }
  }
}

/**
 * Extracts client IP from standard proxy headers
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  
  // Cloudflare
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim()) return cfIp.trim();

  // Standard X-Forwarded-For (take the first public IP)
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  // Real-IP
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp && xRealIp.trim()) return xRealIp.trim();

  return "127.0.0.1";
}

/**
 * Evaluates sliding window rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const prefix = options.keyPrefix ? `${options.keyPrefix}:` : "";
  const key = `${prefix}${identifier}`;
  const windowStart = now - options.windowMs;

  let record = store.get(key);
  if (!record) {
    record = { timestamps: [] };
    store.set(key, record);
  }

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  const currentCount = record.timestamps.length;
  const oldestTimestamp = record.timestamps[0] || now;
  const resetMs = Math.max(0, oldestTimestamp + options.windowMs - now);
  const resetSeconds = Math.max(1, Math.ceil(resetMs / 1000));

  if (currentCount >= options.max) {
    return {
      allowed: false,
      limit: options.max,
      remaining: 0,
      resetSeconds,
    };
  }

  // Register the new request
  record.timestamps.push(now);

  return {
    allowed: true,
    limit: options.max,
    remaining: Math.max(0, options.max - record.timestamps.length),
    resetSeconds,
  };
}

/**
 * Constructs a standardized 429 Too Many Requests response with standard headers
 */
export function createRateLimitResponse(
  result: RateLimitResult,
  customMessage?: string
): NextResponse {
  const message =
    customMessage ||
    `Too many requests. Please slow down and try again in ${result.resetSeconds} second${
      result.resetSeconds === 1 ? "" : "s"
    }.`;

  const headers = new Headers();
  headers.set("X-RateLimit-Limit", result.limit.toString());
  headers.set("X-RateLimit-Remaining", result.remaining.toString());
  headers.set("X-RateLimit-Reset", result.resetSeconds.toString());
  headers.set("Retry-After", result.resetSeconds.toString());
  headers.set("Content-Type", "application/json");

  return NextResponse.json(
    {
      success: false,
      error: message,
      rateLimited: true,
      retryAfter: result.resetSeconds,
    },
    { status: 429, headers }
  );
}

/**
 * Common presets for Chameleon Cheats public endpoints
 */
export const RATE_LIMIT_PRESETS = {
  // Order checkout submission: max 5 orders every 5 minutes per user/IP
  ORDER_CREATE: { windowMs: 5 * 60 * 1000, max: 5, keyPrefix: "order_create" },
  
  // Receipt screenshot upload: max 8 uploads every 5 minutes
  RECEIPT_ATTACH: { windowMs: 5 * 60 * 1000, max: 8, keyPrefix: "receipt_attach" },

  // License verification: max 60 requests per minute
  LICENSE_VERIFY: { windowMs: 60 * 1000, max: 60, keyPrefix: "license_verify" },

  // Referral tracking lookup: max 30 requests per minute
  PROFILE_REFERRALS: { windowMs: 60 * 1000, max: 30, keyPrefix: "profile_referrals" },

  // Admin Discord User List broadcast: max 3 syncs every 2 minutes
  ADMIN_DISCORD_SYNC: { windowMs: 2 * 60 * 1000, max: 3, keyPrefix: "admin_sync" },
};
