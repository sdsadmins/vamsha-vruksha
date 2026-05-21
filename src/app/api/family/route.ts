import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const members = await db.collection("family_members").find({}).toArray();
    return NextResponse.json(members.map(m => ({ ...m, _id: m._id.toString() })));
  } catch (err) {
    console.error("Family GET error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, gender, dob, dod, gotra, native, occupation, phone,
      photoUrl, parentId, spouseId, generation, notes, branch,
    } = body;

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const db = await getDb();
    const doc = {
      name, gender: gender || "M",
      dob: dob || null,
      dod: dod || null,
      gotra: gotra || "Kashyap",
      native: native || "",
      occupation: occupation || "",
      phone: phone || "",
      photoUrl: photoUrl || "",
      parentId: parentId ? new ObjectId(parentId) : null,
      spouseId: spouseId ? new ObjectId(spouseId) : null,
      generation: generation || 1,
      notes: notes || "",
      branch: branch || "Bengaluru",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("family_members").insertOne(doc);
    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (err) {
    console.error("Family POST error:", err);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
