import CompanyEvent from "../../../Models/event.model";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const useremail = searchParams.get("email");
    const eventId = searchParams.get("eventId");
    console.log("User Email:", useremail);

    let eventsListed;
    if (eventId) {
      eventsListed = await CompanyEvent.findById(eventId);
      if (!eventsListed) {
        return new NextResponse(
          JSON.stringify({ message: "Event not found!" }),
          { status: 404 }
        );
      }
    } else if (useremail) {
      eventsListed = await CompanyEvent.find({ createdBy: useremail });
    } else {
      eventsListed = await CompanyEvent.find().sort({ createdAt: -1 }).limit(9);
    }
    return new NextResponse(JSON.stringify(eventsListed), { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
