export interface CartDetails {
  _id: string;
  userDetails: {
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
    };
    company?: string;
    gstNumber?: string;
  };
  planDetails: {
    plan: string;
    amount: number;
    currency: string;
  };
  paymentGateway: string;
  paymentId: string;
  finalAmount: number;
  currency: string;
  purchaseDate: string;
  expiryDate: string;
  status: string;
  signupToken: string;
  isSignupCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartApiResponse {
  success: boolean;
  message: string;
  data?: CartDetails;
  error?: string;
}
