"use server";
import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
    imagePath: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: false,
    },
    eventTitle: {
      type: String,
      required: false,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AdsCreate =
  mongoose.models.AdsCreate || mongoose.model("AdsCreate", adSchema);

export default AdsCreate;
