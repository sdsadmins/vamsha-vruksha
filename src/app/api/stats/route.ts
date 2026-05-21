import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const [totalMembers, pendingVerifications, familyMembers, matrimonialProfiles, totalDonations] =
      await Promise.all([
        db.collection("users").countDocuments(),
        db.collection("users").countDocuments({ verified: false }),
        db.collection("family_members").countDocuments(),
        db.collection("matrimonial").countDocuments(),
        db.collection("donations").countDocuments(),
      ]);

    const donationAgg = await db.collection("donations")
      .aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
      .toArray();
    const totalDonationAmount = donationAgg[0]?.total ?? 0;

    return NextResponse.json({
      totalMembers,
      pendingVerifications,
      familyMembers,
      matrimonialProfiles,
      totalDonations,
      totalDonationAmount,
      activeTrees: Math.max(1, familyMembers > 0 ? Math.ceil(familyMembers / 3) : 0),
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
