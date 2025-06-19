import mongoose from "mongoose";
import { CartSchema } from "@/schemas/cart/cart.schema";
import type { Cart } from "@/types/cart/cart.types";

export const CartModel =
  mongoose.models.Cart || mongoose.model<Cart>("Cart", CartSchema);
