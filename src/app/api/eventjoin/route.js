import { NextResponse } from "next/server";
import Participant from "../../../Models/participant.model";
import CompanyEvent from "../../../Models/event.model";

export async function POST(req) {
  try {
    const { userId, eventId, teamName } = await req.json();

    const event = await CompanyEvent.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }

    const existingParticipant = await Participant.findOne({ userId, eventId });
    if (existingParticipant) {
      return NextResponse.json(
        { message: "Already registered for this event." },
        { status: 400 }
      );
    }

    await Participant.create({
      userId,
      eventId,
      teamName,
    });

    // Return a success response
    return NextResponse.json(
      { message: "Successfully registered for the event." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function Get(req) {
  const { searchParams } = new URL(req.url);

  
}
