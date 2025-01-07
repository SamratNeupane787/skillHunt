import { v2 as cloudinary } from "cloudinary";
import AdsCreate from "../../../Models/ads.model";
import { connectMongoDB } from "../../../lib/mongodb";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // We are handling file uploads with multipart/form-data
  },
};

export async function POST(request) {
  try {
    // Parse the form data
    const form = await request.formData();
    const title = form.get("title");
    const description = form.get("description");
    const date = form.get("date");
    const location = form.get("location");
    const image = form.get("image"); // The uploaded file

    if (!title || !description || !date || !location || !image) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Check if ad already exists
    const adsExist = await AdsCreate.findOne({ title, description, date });
    if (adsExist) {
      return NextResponse.json(
        { message: "Ad already exists" },
        { status: 409 }
      );
    }

    // Upload image to Cloudinary
    const fileBuffer = await image.arrayBuffer(); // Convert to buffer for Cloudinary
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

    // Save ad to the database
    const newAd = await AdsCreate.create({
      title,
      description,
      location,
      date,
      createdBy: form.get("createdBy"),
      imagePath: uploadedResult.secure_url, // Cloudinary URL
    });

    return NextResponse.json(
      { message: "Ad created successfully", ad: newAd },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server Error:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
