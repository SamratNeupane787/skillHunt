import { NextResponse } from "next/server";
import SubmitProject from "@/Models/submitproject.model";
import { connectMongoDB } from "../../../lib/mongodb";

export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

    const projects = await SubmitProject.find({ eventId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching submitted projects:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
