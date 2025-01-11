import { v2 as cloudinary } from "cloudinary";
import AdsCreate from "../../../Models/ads.model";
import { connectMongoDB } from "../../../lib/mongodb";
import { NextResponse } from "next/server";

// backend route.js (API route for fetching ads)
//fetch
export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get("createdBy");

    console.log(createdBy);
    await connectMongoDB();

    let ads;

    if (createdBy) {
      ads = await AdsCreate.find({ createdBy }).sort({ createdAt: -1 });
    } else {
      ads = await AdsCreate.find().sort({ createdAt: -1 }).limit(5);
    }

    return new NextResponse(JSON.stringify(ads), { status: 200 });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { message: "Error fetching ads" },
      { status: 500 }
    );
  }
};
//edit
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, description, date, location, imagePath } = body;

    if (!id || !title || !description || !date || !location) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const updatedAd = await AdsCreate.findByIdAndUpdate(
      id,
      { title, description, date, location, imagePath },
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
    console.error("Error updating ad:", error);
    return NextResponse.json({ message: "Error updating ad" }, { status: 500 });
  }
}
//delete

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
    console.error("Error deleting ad:", error);
    return NextResponse.json({ message: "Error deleting ad" }, { status: 500 });
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    const uploadedImage = await cloudinary.uploader.upload_stream({
      folder: "ads",
    });

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ads" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(Buffer.from(fileBuffer));
    });

    const uploadedResult = await uploadPromise;

    console.log(uploadedResult);

    const newAd = await AdsCreate.create({
      title,
      description,
      location,
      date,
      createdBy,
      imagePath: uploadedResult.secure_url,
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
