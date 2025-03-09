"use server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "../../../lib/generateEsewaSignature";

function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_ESEWA_MERCHANT_CODE",
    "NEXT_PUBLIC_ESEWA_SECRET_KEY",
  ];
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  });
}

export async function POST(req) {
  console.log("Received POST request for eSewa payment");

  try {
    validateEnvironmentVariables();

    const paymentData = await req.json();
    const { amount, productName, transactionId } = paymentData;

    if (!amount || !productName || !transactionId) {
      console.error("Missing required fields:", paymentData);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Initiating eSewa payment");

    const transactionUuid = `${Date.now()}-${uuidv4()}`;
    const esewaConfig = {
      amount: Number(amount),
      tax_amount: 0,
      total_amount: Number(amount),
      transaction_uuid: transactionUuid,
      product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: "http://localhost:3000/AdsPage",
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
    const signature = generateEsewaSignature(
      process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY,
      signatureString
    );

    console.log("eSewa payment session created");

    return NextResponse.json({
      amount: esewaConfig.amount,
      esewaConfig: {
        ...esewaConfig,
        signature,
      },
    });
  } catch (err) {
    console.error("eSewa Payment API Error:", err);
    return NextResponse.json(
      {
        error: "Error creating eSewa payment session",
        details: err.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
