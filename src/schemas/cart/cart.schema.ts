import { Schema } from "mongoose";

export const cartSchema = new Schema(
  {
    userDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: String, required: true },
      },
      company: { type: String },
      gstNumber: { type: String },
    },
    planDetails: {
      plan: { type: String, required: true },
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    paymentGateway: { type: String, required: true },
    paymentId: { type: String, required: true },
    finalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, required: true },
    signupToken: { type: String, required: true, unique: true, index: true },
    isSignupCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
