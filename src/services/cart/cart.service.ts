import { dbConnect } from "@/lib/database/db";
import { Cart } from "@/models/cart/cart.model";
import { CartDetails } from "@/types/cart/cart-api.types";

export class CartService {
  async getCartBySignupToken(signupToken: string): Promise<CartDetails | null> {
    await dbConnect();
    const cart = await Cart.findOne({ signupToken }).lean<CartDetails>().exec();

    if (!cart) {
      return null;
    }
    return cart;
  }
}

export const cartService = new CartService();
