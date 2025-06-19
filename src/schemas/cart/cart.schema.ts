import { Schema } from "mongoose";
import type { Cart } from "@/types/cart/cart.types";

const CartAddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const CartUserDetailsSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    address: { type: CartAddressSchema, required: false },
    company: { type: String },
    gstNumber: { type: String },
  },
  { _id: false }
);

const CartPlanDetailsSchema = new Schema(
  {
    plan: { type: String, enum: ["monthly", "yearly"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  { _id: false }
);

export const CartSchema = new Schema<Cart>(
  {
    userDetails: { type: CartUserDetailsSchema, required: true },
    planDetails: { type: CartPlanDetailsSchema, required: true },
    paymentGateway: { type: String, required: true },
    finalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "expired"],
      required: true,
    },
    paymentId: { type: String },
    purchaseDate: { type: Date },
    expiryDate: { type: Date },
    signupToken: { type: String },
  },
  { timestamps: true }
);
