import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, gotra, native, role = "member", avatar = "1" } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");

    const existing = await users.findOne({ phone });
    if (existing) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
    }

    // Hash a default password (OTP-based auth, so password is secondary)
    const passwordHash = await bcrypt.hash("121212", 10);

    const newUser = {
      name,
      phone,
      gotra: gotra || "Kashyap",
      native: native || "Bangalore, Karnataka",
      role,
      avatar,
      passwordHash,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        name,
        phone,
        gotra: newUser.gotra,
        native: newUser.native,
        role,
        avatar,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
