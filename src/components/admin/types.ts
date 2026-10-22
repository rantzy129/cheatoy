export interface Order {
  id: string;
  order_id: string;
  discord_id: string;
  discord_username: string;
  tier: string;
  price: string;
  payment_method: string;
  reference_no: string;
  sender_name?: string;
  status: "pending" | "approved" | "rejected";
  license_key?: string;
  created_at: string;
  approved_at?: string;
  receipt_url?: string | null;
  referred_by?: string | null;
}

export interface License {
  id: string;
  license_key: string;
  discord_id?: string;
  discord_username?: string;
  tier?: string;
  expires_at?: string | null;
  hwid?: string | null;
  is_banned: boolean;
  created_at: string;
}

export type AdminTab = "orders" | "licenses" | "generator" | "overview" | "notifications";