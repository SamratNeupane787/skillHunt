import User from "../../../Models/user.model";
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
export async function POST(request) {
  const { name, email, role } = await request.json();
  console.log(role);
  await connectMongoDB();

  const userExist = await User.findOne({ email, role });
  if (!userExist) {
    await User.create({ name, email, role });
    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } else {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );
  }
}
