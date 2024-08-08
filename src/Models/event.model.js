"use server";

import mongoose, { Schema } from "mongoose";

const companySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    organizedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
