"use server";
import mongoose, { Schema } from "mongoose";
mongoose.connect(process.env.MONGODB_URL);

const adSchema = new Schema(
  {
    adsTitle: {
      type: String,
      required: true,
    },
    status: {
      type:
    },
    eventId: {
      type: String,
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
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
