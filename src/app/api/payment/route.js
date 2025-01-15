"use server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

function validateEnvironmentVariables() {
  const requiredEnvVars = ["NEXT_PUBLIC_KHALTI_SECRET_KEY"];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }
}

export async function POST(req) {
  console.log("Received POST request to /api/checkout-session");
  try {
    validateEnvironmentVariables();
    const paymentData = await req.json();
    const { amount, productName, transactionId, method } = paymentData;

    if (!amount || !productName || !transactionId || !method) {
      console.error("Missing required fields:", paymentData);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    switch (method) {
      case "khalti": {
        console.log("Initiating Khalti payment");

        const khaltiConfig = {
          return_url: "http://localhost:3000/AdsPage",
          website_url: "http://localhost:3000",
          amount: Math.round(parseFloat(amount) * 100),
          purchase_order_id: transactionId,
          purchase_order_name: productName,
          customer_info: {
            name: "skillhunt",
            email: "skillhunt@gmail.com",
            phone: "9800000000",
          },
        };

        const response = await fetch(
          "https://a.khalti.com/api/v2/epayment/initiate/",
          {
            method: "POST",
            headers: {
              Authorization: `Key ${process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(khaltiConfig),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Khalti API Error:", errorData);
          throw new Error(
            `Khalti payment initiation failed: ${JSON.stringify(errorData)}`
          );
        }

        const khaltiResponse = await response.json();
        console.log("Khalti payment initiated:", khaltiResponse);

        return NextResponse.json({
          khaltiPaymentUrl: khaltiResponse.payment_url,
        });
      }

      default:
        console.error("Invalid payment method:", method);
        return NextResponse.json(
          { error: "Invalid payment method" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Payment API Error:", err);
    return NextResponse.json(
      {
        error: "Error creating payment session",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
