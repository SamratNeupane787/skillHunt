"use server";
import mongoose, { Schema } from "mongoose";
mongoose.connect(process.env.MONGODB_URL);

const participantSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This option will add createdAt and updatedAt fields automatically
  }
);

const Participant =
  mongoose.models.Participant ||
  mongoose.model("Participant", participantSchema);

export default Participant;
