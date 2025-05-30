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


export async function POST(request) {
  try {
    const form = await request.formData();
    const title = form.get("title");
    const description = form.get("description");
    const date = form.get("date");
    const location = form.get("location");
    const image = form.get("image");
    const createdBy = form.get("createdBy");

    if (!title || !description || !date || !location || !image || !createdBy) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const adsExist = await AdsCreate.findOne({
      title,
      description,
      date,
      createdBy,
    });

    if (adsExist) {
      return NextResponse.json(
        { message: "Ad already exists" },
        { status: 409 }
      );
    }

    const fileBuffer = await image.arrayBuffer();

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ads" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(Buffer.from(fileBuffer));
    });

    const moderationResult = await cloudinary.api.resources({
      public_ids: [uploadResult.public_id],
      moderation: "web",
    });

    if (
      moderationResult.resources &&
      moderationResult.resources[0].moderation
    ) {
      const moderationStatus =
        moderationResult.resources[0].moderation[0].status;
      if (moderationStatus === "reject") {
        return NextResponse.json(
          { message: "Image rejected due to NSFW content." },
          { status: 400 }
        );
      }
    }

    const newAd = await AdsCreate.create({
      title,
      description,
      location,
      date,
      createdBy,
      imagePath: uploadResult.secure_url, 
    });

    return NextResponse.json(
      { message: "Ad created successfully", ad: newAd },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}