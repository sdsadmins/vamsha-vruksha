import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignId, campaignTitle, amount, donorName, donorPhone, message, payMethod, wantsCert, donationType } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const db = await getDb();

    const donation = {
      campaignId: campaignId || "general",
      campaignTitle: campaignTitle || "General Welfare Fund",
      amount: Number(amount),
      donorName: donorName || "Anonymous",
      donorPhone: donorPhone || "",
      message: message || "",
      payMethod: payMethod || "upi",
      wantsCert: !!wantsCert,
      donationType: donationType || "onetime",
      createdAt: new Date(),
    };

    const result = await db.collection("donations").insertOne(donation);

    // Bump the campaign's raised total (stored in paise × 100)
    if (campaignId && campaignId !== "quick" && campaignId !== "general") {
      await db.collection("campaigns").updateOne(
        { id: campaignId },
        { $inc: { raised: Number(amount) * 100 } },
        { upsert: false }
      );
    }

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (err) {
    console.error("Donation POST error:", err);
    return NextResponse.json({ error: "Failed to record donation" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const donations = await db.collection("donations").find({}).sort({ createdAt: -1 }).limit(50).toArray();
    return NextResponse.json(donations.map((d) => ({ ...d, _id: d._id.toString() })));
  } catch (err) {
    console.error("Donations GET error:", err);
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}
