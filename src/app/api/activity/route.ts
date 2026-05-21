import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

export async function GET() {
  try {
    const db = await getDb();
    const [recentUsers, recentDonations, recentMembers] = await Promise.all([
      db.collection("users").find({}).sort({ createdAt: -1 }).limit(6).toArray(),
      db.collection("donations").find({}).sort({ createdAt: -1 }).limit(6).toArray(),
      db.collection("family_members").find({}).sort({ createdAt: -1 }).limit(6).toArray(),
    ]);

    type RawEvent = {
      id: string; type: string; user: string; action: string;
      detail: string; time: string; photo: string; _ts: Date | string;
    };

    const events: RawEvent[] = [
      ...recentUsers.map(u => ({
        id: u._id.toString(), type: "tree", user: u.name,
        action: "joined the Samaj",
        detail: u.gotra ? `${u.gotra} Gotra` : "",
        time: timeAgo(u.createdAt), photo: "", _ts: u.createdAt ?? new Date(0),
      })),
      ...recentDonations.map(d => ({
        id: d._id.toString(), type: "archive", user: d.donorName || "Anonymous",
        action: "contributed",
        detail: `₹${Number(d.amount).toLocaleString("en-IN")} to ${d.campaignTitle || "Welfare Fund"}`,
        time: timeAgo(d.createdAt), photo: "", _ts: d.createdAt ?? new Date(0),
      })),
      ...recentMembers.map(m => ({
        id: m._id.toString(), type: "tree", user: m.name,
        action: "was added to the family tree",
        detail: `${m.gotra || ""} · Gen ${m.generation || 1}`,
        time: timeAgo(m.createdAt), photo: m.photoUrl || "", _ts: m.createdAt ?? new Date(0),
      })),
    ];

    events.sort((a, b) => new Date(b._ts).getTime() - new Date(a._ts).getTime());

    return NextResponse.json(events.slice(0, 10).map(({ _ts, ...e }) => e));
  } catch (err) {
    console.error("Activity error:", err);
    return NextResponse.json([], { status: 200 }); // graceful fallback
  }
}
