import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidateId, candidateName, fromPhone, fromName, message } = body;

    if (!candidateId) {
      return NextResponse.json({ error: "candidateId is required" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("interests").insertOne({
      candidateId,
      candidateName: candidateName || "",
      fromPhone: fromPhone || "",
      fromName: fromName || "Anonymous",
      message: message || "",
      status: "pending_review",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (err) {
    console.error("Interest POST error:", err);
    return NextResponse.json({ error: "Failed to save interest" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const interests = await db.collection("interests").find({}).sort({ createdAt: -1 }).limit(50).toArray();
    return NextResponse.json(interests.map(i => ({ ...i, _id: i._id.toString() })));
  } catch (err) {
    console.error("Interest GET error:", err);
    return NextResponse.json({ error: "Failed to fetch interests" }, { status: 500 });
  }
}
