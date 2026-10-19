import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://emdjnrokrgotaxebqrpo.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtZGpucm9rcmdvdGF4ZWJxcnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMTg4MzMsImV4cCI6MjEwNzg5NDgzM30.2ywjxIchxg3wHZcUGuVkq4UrGwJmKs-QmesbB-An8Gg";

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  tag: string;
  avatar_url?: string;
  email?: string;
}

export function extractDiscordUser(user: any): DiscordUser | null {
  if (!user) return null;
  const meta = user.user_metadata || {};
  
  const discordId = meta.provider_id || meta.sub || user.id || "";
  const rawUsername =
    meta.user_name ||
    meta.preferred_username ||
    meta.custom_claims?.preferred_username ||
    meta.name ||
    meta.full_name ||
    user.email?.split("@")[0] ||
    "DiscordUser";

  // Strip trailing '#0' or '#0000' from modern Discord handles
  const username = rawUsername.replace(/#0+$/, "").trim();

  const globalName =
    meta.custom_claims?.global_name || meta.full_name || meta.name || username;

  const rawDiscriminator = meta.custom_claims?.discriminator || meta.discriminator || "";
  const tag =
    rawDiscriminator && rawDiscriminator !== "0" && rawDiscriminator !== "0000"
      ? rawDiscriminator
      : "";

  // Resolve Discord Avatar URL
  let avatarUrl = meta.avatar_url || meta.picture || "";
  if (!avatarUrl && discordId && meta.avatar) {
    avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${meta.avatar}.png?size=256`;
  }
  if (!avatarUrl && discordId) {
    try {
      const idx = Number((BigInt(discordId) >> BigInt(22)) % BigInt(6));
      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
    } catch {
      avatarUrl = "https://cdn.discordapp.com/embed/avatars/0.png";
    }
  }

  return {
    id: discordId,
    username,
    global_name: globalName,
    tag,
    avatar_url: avatarUrl,
    email: user.email,
  };
}

export function getStoredUser(): DiscordUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("af_discord_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: DiscordUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("af_discord_user", JSON.stringify(user));
  } catch (e) {
    console.warn("Error storing user:", e);
  }
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("af_discord_user");
  } catch (e) {
    console.warn("Error clearing user:", e);
  }
}

export async function signInWithDiscord(redirectTo?: string) {
  if (typeof window === "undefined") return;

  const destination = redirectTo || `${window.location.origin}/profile`;

  if (supabase) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: destination,
      },
    });
    if (error) {
      console.warn("Supabase client sign-in failed, falling back to direct URL:", error.message);
      window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=discord&redirect_to=${encodeURIComponent(destination)}`;
    }
  } else {
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=discord&redirect_to=${encodeURIComponent(destination)}`;
  }
}

export async function signOut() {
  clearStoredUser();
  if (supabase) {
    await supabase.auth.signOut();
  }
}
