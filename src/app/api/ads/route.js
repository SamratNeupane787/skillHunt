import { v2 as cloudinary } from "cloudinary";
import AdsCreate from "../../../Models/ads.model";
import { connectMongoDB } from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const ads = await AdsCreate.find().sort({ createdAt: -1 });
    return NextResponse.json(ads, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching ads" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    await connectMongoDB();

    const updatedAd = await AdsCreate.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAd) {
      return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Ad updated successfully", ad: updatedAd },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error updating ad" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Ad ID is required" }, { status: 400 });
  }

  try {
    await connectMongoDB();
    const deletedAd = await AdsCreate.findByIdAndDelete(id);

    if (!deletedAd) {
      return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Ad deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error deleting ad" }, { status: 500 });
  }
}
