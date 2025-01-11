import { connectMongoDB } from "../../../lib/mongodb";
import CompanyEvent from "../../../Models/event.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { title, description, date, location, createdBy, email } =
    await request.json();

  try {
    await connectMongoDB();
  } catch (error) {
    return NextResponse.json(
      { message: "MongoDB connection error" },
      { status: 500 }
    );
  }

  const dataExist = await CompanyEvent.findOne({
    title,
    createdBy,
    location,
  });

  if (!dataExist) {
    await CompanyEvent.create({
      title,
      description,
      date,
      location,
      createdBy,
      email,
    });
    return NextResponse.json(
      { message: "Event Created Successfully" },
      { status: 201 }
    );
  } else {
    return NextResponse.json(
      { message: "An event with the same name already exists!" },
      { status: 409 }
    );
  }
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await CompanyEvent.findByIdAndDelete(id);
  return NextResponse.json({ message: "Event deleted" }, { status: 200 });
}
