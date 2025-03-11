import { NextResponse } from "next/server";
import SubmitProject from "../../../Models/submitproject.model";
import { connectMongoDB } from "@/lib/mongodb";

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

export async function POST(request) {
  try {
    await connectMongoDB();
    const { eventId, githubRepo, teamName, liveUrl, submitedBy } =
      await request.json();

    if (!eventId || !githubRepo || !teamName || !submitedBy || !liveUrl) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if a project is already submitted for this event and team
    const existingProject = await SubmitProject.findOne({ eventId, teamName });

    if (existingProject) {
      return NextResponse.json(
        { message: "Project already submitted for this team." },
        { status: 409 }
      );
    }

    const newProject = await SubmitProject.create({
      eventId,
      githubRepo,
      teamName,
      liveUrl,
      submitedBy,
    });

    return NextResponse.json(
      { message: "Project submitted successfully!", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
