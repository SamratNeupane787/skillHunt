import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      enum: ["software", "hardware", "ui/ux"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CompanyEvent =
  mongoose.models.CompanyEvent || mongoose.model("CompanyEvent", EventSchema);

export default CompanyEvent;
