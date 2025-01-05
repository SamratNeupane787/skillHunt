import AdsCreate from "../../../Models/event.model";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export default async function POST(request) {
  const { adsTitle, description, date } = await request.json();
  try {
    await connectMongoDB();
  } catch (error) {
    return NextResponse.json(
      {
        message: "MongoDB Connection error",
      },
      { status: 500 }
    );
  }

  const adsExist = await AdsCreate.findOne({
    adsTitle,
    description,
    date,
  });

  if (!adsExist) {
    await AdsCreate.create({
      adsTitle,
      description,
      date,
    });
    return NextResponse.json(
      {
        message: "Ads Created succesfully",
      },
      {
        status: 201,
      }
    );
  } else {
    return NextResponse.json(
      {
        message: "Error creating ads",
      },
      {
        status: 409,
      }
    );
  }
}
