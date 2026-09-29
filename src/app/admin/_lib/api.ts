// Typed calls for the admin panel.
//
// The admin signs in through the ordinary /login (OTP) and gets the same
// session as any member, so these calls go through the shared API client in
// src/lib/api.ts, which attaches that token. The server checks the role.

import { API_BASE_URL, ApiError, apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/api";
import { getToken } from "@/lib/auth";

export { errorMessage } from "@/lib/api";

/* ─────────────────────────── Types ─────────────────────────────────────── */

export type AdminRole = "member" | "elder" | "admin";

export type AdminMember = {
  id: string;
  samajId: string;
  userName: string;
  name: string;
  phone: string;
  role: AdminRole;
  gotra: string;
  native: string;
  gender: string;
  maritalStatus: string;
  profileUrl: string;
  verified: boolean;
  bio: string;
  occupation: string;
  matrimonialOptIn: boolean;
  showPhoneToMembers: boolean;
  isPurohit: boolean;
  dob: string;
  address: string;
  masked_aadhaar: string;
  hasDonated: boolean;
  currentAddress: {
    country: string;
    state: string;
    district: string;
    taluk: string;
    city: string;
    area: string;
    street: string;
    landmark: string;
    pincode: string;
  };
  createdAt: string | null;
  lastLoginAt: string | null;
};

export type AdminMemberPage = {
  count: number;
  page: number;
  limit: number;
  users: AdminMember[];
};

export type CommunityStats = {
  totalMembers: number;
  pendingVerifications: number;
  familyMembers: number;
  matrimonialProfiles: number;
  totalDonations: number;
  totalDonationAmount: number;
  activeTrees: number;
};

export type SignupVerification = "email" | "phone" | "both";

export type AppSettings = {
  signupVerification: SignupVerification;
  requiresEmail: boolean;
  requiresPhone: boolean;
};

/* ─────────────────────────── Calls ─────────────────────────────────────── */

const P = "/api/admin/panel";

export const adminApi = {
  stats: () => apiGet<CommunityStats>(`${P}/stats`),

  members: (query: {
    q?: string;
    role?: AdminRole | "";
    verified?: "true" | "false" | "";
    page?: number;
    limit?: number;
  }) => apiGet<AdminMemberPage>(`${P}/members`, { query }),
  member: (id: string) => apiGet<AdminMember>(`${P}/members/${id}`),
  updateMember: (
    id: string,
    patch: Partial<
      Pick<AdminMember, "role" | "verified" | "hasDonated" | "isPurohit">
    >,
  ) => apiPatch<AdminMember>(`${P}/members/${id}`, patch),
  deleteMember: (id: string) =>
    apiDelete<{ success: true }>(`${P}/members/${id}`),

  settings: () => apiGet<AppSettings>(`${P}/settings`),
  updateSettings: (signupVerification: SignupVerification) =>
    apiPatch<AppSettings>(`${P}/settings`, { signupVerification }),
};

/* ─────────────────────────── Dropdown master data ──────────────────────── */

/** One entry of a pick list, as the server returns it (MasterItemView). */
export type MasterItem = {
  id: string;
  /** Shown to members. */
  name: string;
  /** Stored on the member's record. */
  value: string;
  order: number;
  active: boolean;
  image: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type MasterItemInput = Partial<Pick<MasterItem, "name" | "value" | "order" | "active" | "image">>;

/**
 * CRUD for one list. `route` is the path segment after /api/master/, e.g.
 * "gotras". Reads of the public list need no token; everything else is admin.
 */
export const masterApi = (route: string) => {
  const base = `/api/master/${route}`;
  return {
    listActive: () => apiGet<MasterItem[]>(base, { anonymous: true }),
    listAll: () => apiGet<MasterItem[]>(`${base}/all`),
    create: (input: MasterItemInput & { name: string }) => apiPost<MasterItem>(base, input),
    update: (id: string, input: MasterItemInput) => apiPatch<MasterItem>(`${base}/${id}`, input),
    remove: (id: string) => apiDelete<{ success: true }>(`${base}/${id}`),
    reorder: (ids: string[]) => apiPut<MasterItem[]>(`${base}/reorder`, { ids }),
    /**
     * Upload a picture for an entry (lists that support it, e.g. Kuladevata).
     * Multipart, so it bypasses the JSON client; returns the public S3 URL to
     * store as the entry's `image`.
     */
    uploadImage: async (file: File): Promise<string> => {
      const form = new FormData();
      form.append("media", file);
      const headers: Record<string, string> = {};
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      let res: Response;
      try {
        res = await fetch(`${API_BASE_URL}${base}/upload-image`, { method: "POST", headers, body: form });
      } catch {
        throw new ApiError(0, "Cannot reach the server. Check your connection.");
      }
      const body = (await res.json().catch(() => null)) as { url?: string; message?: string | string[] } | null;
      if (!res.ok || !body?.url) {
        const msg = Array.isArray(body?.message) ? body.message.join(". ") : body?.message;
        throw new ApiError(res.status, msg || `Upload failed (${res.status})`, body);
      }
      return body.url;
    },
  };
};

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
