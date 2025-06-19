import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/payment/paypal/paypal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, description, reference_id, cartId } = body;

    // Validate required fields
    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Amount and currency are required" },
        { status: 400 }
      );
    }

    // Validate currency (only USD for non-Indian users)
    if (currency !== "USD") {
      return NextResponse.json(
        { error: "Only USD currency is supported for PayPal payments" },
        { status: 400 }
      );
    }

    // Create PayPal order
    const order = await createPayPalOrder({
      amount: parseFloat(amount),
      currency,
      description: description || "Reebews Subscription",
      reference_id: reference_id || `order_${Date.now()}`,
      cartId,
    });

    // Find the approve link in the order response
    const approveLink = order.links.find(
      (link: { rel: string; href: string }) => link.rel === "approve"
    );

    return NextResponse.json({
      ...order,
      redirectUrl: approveLink ? approveLink.href : null,
    });
  } catch (error: any) {
    console.error("PayPal order creation failed:", error);

    return NextResponse.json(
      {
        error: "Failed to create PayPal order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
