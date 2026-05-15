// /Users/abhijeet/Documents/family-tree/app/src/lib/auth.ts
// Client-side only fake auth using localStorage

import { TEST_USERS } from "./data";

export type VVUser = {
  name: string;
  phone: string;
  role: "member" | "elder";
  gotra: string;
  native: string;
  avatar: string;
};

export function verifyOtp(phone: string, otp: string): VVUser | null {
  if (otp !== "121212") return null;
  const user = TEST_USERS.find((u) => u.phone === phone);
  if (!user) {
    // Any unknown number with correct OTP gets a default member account
    return { name: "Samaj Member", phone, role: "member", gotra: "Kashyap", native: "Karnataka", avatar: "SM" };
  }
  return user as VVUser;
}

export function saveUser(user: VVUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem("vv_user", JSON.stringify(user));
  }
}

export function getUser(): VVUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("vv_user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vv_user");
  }
}
