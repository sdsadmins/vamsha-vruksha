import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

const DEMO_USERS = [
  {
    name: "Priya Kamat",
    phone: "9876543210",
    gotra: "Kashyap",
    native: "Bengaluru, Karnataka",
    role: "member",
    avatar: "6",
    verified: true,
  },
  {
    name: "Shri Narayanarao Shet",
    phone: "9999999999",
    gotra: "Bharadwaja",
    native: "Kundapura, Karnataka",
    role: "elder",
    avatar: "1",
    verified: true,
  },
  {
    name: "Ananya Sharma",
    phone: "9871234567",
    gotra: "Bharadwaja",
    native: "New Delhi",
    role: "member",
    avatar: "2",
    verified: true,
  },
];

export async function POST() {
  try {
    const db = await getDb();
    const users = db.collection("users");
    const passwordHash = await bcrypt.hash("121212", 10);

    let seeded = 0;
    let skipped = 0;
    for (const seed of DEMO_USERS) {
      const existing = await users.findOne({ phone: seed.phone });
      if (!existing) {
        await users.insertOne({
          ...seed,
          passwordHash,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: null,
        });
        seeded++;
      } else {
        skipped++;
      }
    }

    return NextResponse.json({ success: true, seeded, skipped });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "POST to this endpoint to seed demo accounts" });
}
