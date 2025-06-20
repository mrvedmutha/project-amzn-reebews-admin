import { dbConnect } from "@/lib/database/db";
import { Cart } from "@/models/cart/cart.model";
import { CartDetails } from "@/types/cart/cart-api.types";

export class CartService {
  async getCartBySignupToken(signupToken: string): Promise<CartDetails | null> {
    await dbConnect();
    const cart = await Cart.findOne({ signupToken }).lean().exec();

    if (!cart) {
      return null;
    }

    // Mongoose's lean() returns a plain object, but we need to ensure dates are strings
    // as expected by the CartDetails interface. The _id also needs to be converted.
    return {
      ...cart,
      _id: cart._id.toString(),
      purchaseDate: cart.purchaseDate.toISOString(),
      expiryDate: cart.expiryDate.toISOString(),
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    } as unknown as CartDetails;
  }
}

export const cartService = new CartService();
