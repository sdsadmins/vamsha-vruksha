// Client-side session state.
//
// The server owns authentication now: it checks the one-time code and issues a
// JWT. This module only remembers the token and the profile that came back
// with it, so the UI can render a name and the API client can attach a header.

const USER_KEY = "vv_user";
const TOKEN_KEY = "vv_token";

/** The account as the API returns it (`PublicUser` on the server). */
export type VVUser = {
  id: string;
  samajId: string;
  userName: string;
  name: string;
  phone: string;
  role: "member" | "elder";
  gotra: string;
  native: string;
  gender: string;
  profileUrl: string;
  verified: boolean;
  bio: string;
  occupation: string;
  matrimonialOptIn: boolean;
  showPhoneToMembers: boolean;
  isPurohit: boolean;
  dob: string;
  address: string;
  email: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  currentAddress?: {
    state?: string;
    city?: string;
    area?: string;
    street?: string;
    landmark?: string;
    pincode?: string;
    location?: { lat?: number; lng?: number };
  };
  /** Legacy field the older screens read for their avatar initials. */
  avatar?: string;
};

export function saveUser(user: VVUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): VVUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VVUser;
  } catch {
    return null;
  }
}

/** Merge a partial update into the stored profile (after a profile edit). */
export function mergeUser(patch: Partial<VVUser>) {
  const current = getUser();
  if (!current) return;
  saveUser({ ...current, ...patch });
}

export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Store everything a successful login/register returns, in one call. */
export function saveSession(user: VVUser, token: string) {
  saveToken(token);
  saveUser(user);
}

/** Sign out: the token and the profile always go together. */
export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Kept for the older call sites that only ever cleared the profile. */
export const clearUser = clearSession;

export function isSignedIn(): boolean {
  return Boolean(getToken() && getUser());
}

/**
 * Picture to show for a member: their uploaded photo if they have one, else
 * the local illustrated avatar the older screens keyed off `avatar`. Returns
 * "" when there is neither, which the callers render as a blank circle.
 */
export function avatarSrc(
  user: Pick<VVUser, "profileUrl" | "avatar"> | null | undefined,
  avatarSvgs: Record<string, string>,
): string {
  if (!user) return "";
  if (user.profileUrl) return user.profileUrl;
  return (user.avatar && avatarSvgs[user.avatar]) || "";
}
