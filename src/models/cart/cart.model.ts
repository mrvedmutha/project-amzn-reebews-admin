import mongoose from "mongoose";
import { cartSchema } from "@/schemas/cart/cart.schema";
import { CartDetails } from "@/types/cart/cart-api.types";

// Check if the model is already defined before defining it
export const Cart =
  mongoose.models.Cart || mongoose.model<CartDetails>("Cart", cartSchema);
