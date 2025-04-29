import User from "../../../Models/user.model";
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";

// ✅ Register a New User
export async function POST(request) {
  try {
    const { name, email, role } = await request.json();
    await connectMongoDB();

    const userExist = await User.findOne({ email });
    if (userExist) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    await User.create({ name, email, role, status: "active" });
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ Get All Users (Sorted by Created Date)
export async function GET() {
  try {
    await connectMongoDB();
    const userList = await User.find().sort({ createdAt: -1 });

    return NextResponse.json(userList, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}

// ✅ Delete a User
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}

// ✅ Update User Role (Promote/Demote)
export async function PUT(request) {
  try {
    const { id, role } = await request.json();
    await connectMongoDB();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User role updated", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { message: "Error updating role" },
      { status: 500 }
    );
  }
}

// ✅ Block or Unblock User
export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    await connectMongoDB();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `User ${status}` }, { status: 200 });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { message: "Error updating user status" },
      { status: 500 }
    );
  }
}
