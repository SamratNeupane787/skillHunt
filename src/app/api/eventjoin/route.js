import { NextResponse } from "next/server";
import Participant from "../../../Models/participant.model";
import CompanyEvent from "../../../Models/event.model";
import { URL } from "url";

export async function POST(req) {
  try {
    const { userId, eventId, teamName, eventTitle } = await req.json();
    console.log("Received eventTitle in API:", eventTitle);

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
      eventTitle,
    });

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

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("email");

    const eventsJoined = await Participant.find({ userId: userEmail });

    if (!eventsJoined || eventsJoined.length === 0) {
      return NextResponse.json(
        { message: "No events joined." },
        { status: 404 }
      );
    }

    return NextResponse.json(eventsJoined, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
};
