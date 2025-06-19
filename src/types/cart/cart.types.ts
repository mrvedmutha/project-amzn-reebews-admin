import { Types } from "mongoose";

export interface CartUserDetails {
  name: string;
  email: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  company?: string;
  gstNumber?: string;
}

export interface CartPlanDetails {
  plan: "monthly" | "yearly";
  amount: number;
  currency: string;
}

export interface Cart {
  _id: Types.ObjectId;
  userDetails: CartUserDetails;
  planDetails: CartPlanDetails;
  paymentGateway: string;
  finalAmount: number;
  currency: string;
  status: "pending" | "completed" | "expired";
  paymentId?: string;
  purchaseDate?: Date;
  expiryDate?: Date;
  signupToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
