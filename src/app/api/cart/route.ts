import { NextRequest, NextResponse } from "next/server";
import { CartApiResponse } from "@/types/cart/cart-api.types";
import { cartService } from "@/services/cart/cart.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const signupToken = searchParams.get("signup");

  if (!signupToken) {
    const response: CartApiResponse = {
      success: false,
      message: "Signup token is required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    const cart = await cartService.getCartBySignupToken(signupToken);

    if (!cart) {
      const response: CartApiResponse = {
        success: false,
        message: "Cart not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Check if the signup link has already been used
    if (cart.isSignupCompleted) {
      const response: CartApiResponse = {
        success: false,
        message: "This signup link has already been used.",
      };
      return NextResponse.json(response, { status: 409 });
    }

    const response: CartApiResponse = {
      success: true,
      message: "Cart details fetched successfully",
      data: cart,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching cart from DB:", error);
    const response: CartApiResponse = {
      success: false,
      message: "An internal server error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
