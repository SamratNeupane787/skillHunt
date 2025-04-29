import mongoose, { Schema } from "mongoose";

const submitProjectSchema = new Schema(
  {
    teamName: { type: String, required: true },
    githubRepo: { type: String, required: true },
    eventId: { type: String, required: true },
    liveUrl: { type: String, required: true },
    submitedBy: { type: String, required: true },
  },
  { timestamps: true }
);

const SubmitProject =
  mongoose.models.SubmitProject ||
  mongoose.model("SubmitProject", submitProjectSchema);

export default SubmitProject;
