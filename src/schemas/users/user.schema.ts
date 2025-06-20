import { Schema } from "mongoose";

// Sub-schema for address to be embedded in the user schema
const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

export const userSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    address: { type: addressSchema, required: true },
  },
  { timestamps: true }
);
