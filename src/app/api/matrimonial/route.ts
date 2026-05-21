import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const profiles = await db.collection("matrimonial").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(
      profiles.map((p) => ({ ...p, _id: p._id.toString() }))
    );
  } catch (err) {
    console.error("Matrimonial GET error:", err);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, gender, age, gotra, location, education, company, phone } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("matrimonial").insertOne({
      name,
      gender: gender || "M",
      age: age || null,
      gotra: gotra || "Kashyap",
      location: location || "Bengaluru",
      education: education || "",
      company: company || "",
      phone,
      verified: false,
      status: "pending_review",
      photo: "",
      familyType: "Nuclear",
      height: "",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (err) {
    console.error("Matrimonial POST error:", err);
    return NextResponse.json({ error: "Failed to submit profile" }, { status: 500 });
  }
}
