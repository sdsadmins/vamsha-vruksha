import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const pending = await db.collection("users")
      .find({ verified: false })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      pending.map(u => ({
        id: u._id.toString(),
        name: u.name,
        phone: u.phone,
        gotra: u.gotra || "—",
        native: u.native || "—",
        role: u.role || "member",
        createdAt: u.createdAt,
        verified: u.verified,
      }))
    );
  } catch (err) {
    console.error("Verifications GET error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json(); // action: "approve" | "reject"
    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { verified: action === "approve", updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verifications PATCH error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
