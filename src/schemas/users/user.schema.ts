import { Schema } from "mongoose";
import { User } from "@/types/users/user.types";

const UserPlanAddOnSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    purchaseDate: { type: Date, required: true },
    expiryDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      required: true,
      default: "active",
    },
  },
  { _id: false }
);

const UserPlanDetailsSchema = new Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    purchaseDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      required: true,
      default: "active",
    },
    addOns: [UserPlanAddOnSchema],
  },
  { _id: false }
);

const UserPurchaseHistorySchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["plan", "addon"],
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    purchaseDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["completed", "refunded", "failed"],
      required: true,
      default: "completed",
    },
  },
  { _id: false }
);

const UserProductSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["review", "campaign", "promotion"],
      required: true,
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      required: true,
      default: "active",
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true, _id: false }
);

export const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    name: { type: String },
    authProvider: {
      type: String,
      enum: ["email", "google"],
      required: true,
      default: "email",
    },
    planDetails: {
      type: UserPlanDetailsSchema,
      required: true,
    },
    purchaseHistory: [UserPurchaseHistorySchema],
    products: [UserProductSchema],
  },
  { timestamps: true }
);
