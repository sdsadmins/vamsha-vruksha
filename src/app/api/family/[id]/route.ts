import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const member = await db.collection("family_members").findOne({ _id: new ObjectId(id) });
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...member, _id: member._id.toString() });
  } catch (err) {
    console.error("Family GET error:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = await getDb();

    const { _id, createdAt, ...updates } = body;
    void _id; void createdAt;

    await db.collection("family_members").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Family PUT error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    await db.collection("family_members").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Family DELETE error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
