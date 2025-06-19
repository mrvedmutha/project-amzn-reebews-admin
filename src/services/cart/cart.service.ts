import { CartModel } from "@/models/cart/cart.model";
import type { Cart } from "@/types/cart/cart.types";
import { dbConnect } from "@/lib/database/db";

export const cartService = {
  /**
   * Find a cart by signup token
   * @param token - The signup token to search for
   * @returns The cart if found and completed, null otherwise
   */
  async findBySignupToken(token: string): Promise<Cart | null> {
    await dbConnect();
    const cart = await CartModel.findOne({
      signupToken: token,
      status: "completed",
    }).lean();
    return cart as Cart | null;
  },

  /**
   * Validate if a signup token exists and is valid
   * @param token - The signup token to validate
   * @returns true if the token is valid, false otherwise
   */
  async validateSignupToken(token: string): Promise<boolean> {
    await dbConnect();
    const cart = await CartModel.findOne({
      signupToken: token,
      status: "completed",
    })
      .select("_id")
      .lean();
    return cart !== null;
  },
};
