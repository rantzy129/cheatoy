import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

export interface VersionConfig {
  minVersion: string;
  latestVersion: string;
  downloadUrl: string;
  updatedAt: string;
}

const DEFAULT_CONFIG: VersionConfig = {
  minVersion: process.env.LOADER_MIN_VERSION || "v1.0.10",
  latestVersion: process.env.LOADER_MIN_VERSION || "v1.0.10",
  downloadUrl: "https://www.chameleon-cheats.tech/profile",
  updatedAt: new Date().toISOString(),
};

const STORAGE_FILE = path.join(process.cwd(), "data", "app_version.json");
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function ensureDir() {
  const dir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch { }
  }
}

/**
 * Compare two semver-like strings: e.g. "v1.0.10" vs "v1.0.10"
 * Returns true if clientVersion < requiredVersion or if clientVersion is missing/empty.
 */
export function isVersionOutdated(clientVersion: string | null | undefined, requiredVersion: string): boolean {
  if (!clientVersion || !clientVersion.trim()) {
    return true; // Legacy versions that don't send a version are strictly outdated
  }

  const cleanClient = clientVersion.trim().toLowerCase().replace(/^v/, "");
  const cleanReq = requiredVersion.trim().toLowerCase().replace(/^v/, "");

  if (cleanClient === cleanReq) return false;

  const clientParts = cleanClient.split(".").map((p) => parseInt(p, 10) || 0);
  const reqParts = cleanReq.split(".").map((p) => parseInt(p, 10) || 0);

  const maxLen = Math.max(clientParts.length, reqParts.length);
  for (let i = 0; i < maxLen; i++) {
    const c = clientParts[i] ?? 0;
    const r = reqParts[i] ?? 0;
    if (c < r) return true;
    if (c > r) return false;
  }

  return false;
}

/**
 * Fetch current minimum loader version from Supabase (with file/env fallback)
 */
export async function getMinLoaderVersion(): Promise<VersionConfig> {
  // 1. Try cloud database (Supabase)
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", "system-loader-version")
      .single();

    if (!error && data?.title) {
      return {
        minVersion: data.title.trim(),
        latestVersion: data.title.trim(),
        downloadUrl: data.message?.trim() || DEFAULT_CONFIG.downloadUrl,
        updatedAt: data.created_at || new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn("[VersionControl] Supabase read exception:", e);
  }

  // 2. Fallback to local data file
  try {
    ensureDir();
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed?.minVersion) return parsed;
    }
  } catch { }

  return DEFAULT_CONFIG;
}

/**
 * Save minimum loader version to Supabase & local file
 */
export async function setMinLoaderVersion(
  minVersion: string,
  downloadUrl = "https://www.chameleon-cheats.tech/profile"
): Promise<VersionConfig> {
  const cleanVer = minVersion.trim().replace(/^v/i, "");
  const cleanUrl = downloadUrl.trim() || DEFAULT_CONFIG.downloadUrl;
  const config: VersionConfig = {
    minVersion: cleanVer,
    latestVersion: cleanVer,
    downloadUrl: cleanUrl,
    updatedAt: new Date().toISOString(),
  };

  // 1. Persist to Supabase
  try {
    // Delete existing record first to satisfy RLS policies that disallow UPDATE on public
    await supabase.from("notifications").delete().eq("id", "system-loader-version");
    await supabase.from("notifications").insert({
      id: "system-loader-version",
      sender: "Chameleon Cheats",
      title: cleanVer,
      message: cleanUrl,
      type: "update",
      target: "system_version",
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("[VersionControl] Supabase write exception:", e);
  }

  // 2. Persist to local JSON file
  try {
    ensureDir();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch (e) {
    console.warn("[VersionControl] Local file write exception:", e);
  }

  return config;
}
