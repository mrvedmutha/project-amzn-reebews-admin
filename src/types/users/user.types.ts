import { Types } from "mongoose";

export interface UserPlanAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  purchaseDate: Date;
  expiryDate?: Date;
  status: "active" | "expired" | "cancelled";
}

export interface UserPlanDetails {
  name: string;
  amount: number;
  currency: string;
  purchaseDate: Date;
  expiryDate: Date;
  status: "active" | "expired" | "cancelled";
  addOns: UserPlanAddOn[];
}

export interface UserPurchaseHistory {
  id: string;
  type: "plan" | "addon";
  name: string;
  description: string;
  amount: number;
  currency: string;
  purchaseDate: Date;
  status: "completed" | "refunded" | "failed";
}

export interface UserProduct {
  id: string;
  name: string;
  type: "review" | "campaign" | "promotion";
  description: string;
  status: "active" | "inactive" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id?: Types.ObjectId;
  email: string;
  password?: string;
  name?: string;
  authProvider: "email" | "google";
  planDetails: UserPlanDetails;
  purchaseHistory: UserPurchaseHistory[];
  products: UserProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}
