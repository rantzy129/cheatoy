import crypto from "crypto";

function getAdminPin(): string {
  return (process.env.ADMIN_PIN || "chameleon2026").trim();
}

function getAdminSecret(): string {
  return (process.env.ADMIN_SECRET_KEY || "chameleon_secure_admin_key_2026_salt").trim();
}

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory rate-limiter for failed PIN attempts
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

export function checkRateLimit(clientIp: string): { allowed: boolean; remainingLockoutSeconds?: number } {
  const record = failedAttempts.get(clientIp);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const remaining = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingLockoutSeconds: remaining };
  }

  // Lock expired
  if (record.lockedUntil <= now && record.count >= 5) {
    failedAttempts.delete(clientIp);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(clientIp: string): number {
  const now = Date.now();
  const record = failedAttempts.get(clientIp) || { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= 5) {
    // Lock out for 15 minutes after 5 failed attempts
    record.lockedUntil = now + 15 * 60 * 1000;
  }
  failedAttempts.set(clientIp, record);
  return record.count;
}

export function resetRateLimit(clientIp: string): void {
  failedAttempts.delete(clientIp);
}

/**
 * Creates a cryptographically signed admin session token
 */
export function generateAdminToken(): string {
  const timestamp = Date.now().toString();
  const secret = getAdminSecret();
  const pin = getAdminPin();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${timestamp}:${pin}`);
  const signature = hmac.digest("hex");
  return `${timestamp}.${signature}`;
}

/**
 * Validates a signed admin session token or master PIN
 */
export function verifyAdminSession(tokenOrPin?: string | null): boolean {
  if (!tokenOrPin) return false;

  const currentPin = getAdminPin();
  const currentSecret = getAdminSecret();

  // Direct PIN check fallback for server-to-server or initial validation
  if (tokenOrPin === currentPin) {
    return true;
  }

  // Signed token check: format <timestamp>.<signature>
  const parts = tokenOrPin.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration
  if (Date.now() - timestamp > TOKEN_TTL_MS) {
    return false;
  }

  // Verify HMAC signature with timing-safe comparison
  const hmac = crypto.createHmac("sha256", currentSecret);
  hmac.update(`${timestampStr}:${currentPin}`);
  const expectedSignature = hmac.digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Extracts admin session token from incoming HTTP Request
 * Priority: HTTP-Only Cookie -> Authorization Header -> Custom Header
 */
export function getAdminTokenFromRequest(request: Request): string | null {
  // 1. Check HTTP-Only Cookie
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(/chameleon_admin_session=([^;]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1].trim());
    }
  }

  // 2. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  // 3. Check X-Admin-Token header
  const customHeader = request.headers.get("x-admin-token");
  if (customHeader) {
    return customHeader.trim();
  }

  return null;
}

