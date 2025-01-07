"use server";
import mongoose, { Schema } from "mongoose";

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the ad schema
const adSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: String,
      required: true, // Ensure the user creating the ad is recorded
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"], // Restrict status values
      default: "active", // Default to active
    },
    imagePath: {
      type: String,
      required: true, // Cloudinary URL for the uploaded image
    },
    eventId: {
      type: String,
      required: false, // Optional: For linking ads to specific events
    },
    eventTitle: {
      type: String,
      required: false, // Optional: Title of the associated event
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create or retrieve the model
const AdsCreate =
  mongoose.models.AdsCreate || mongoose.model("AdsCreate", adSchema);

export default AdsCreate;
