import mongoose, { Schema } from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Connected to mongodb");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
