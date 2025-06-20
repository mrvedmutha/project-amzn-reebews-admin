import { CartApiResponse, CartDetails } from "@/types/cart/cart-api.types";

export class CartApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.APP_URL || "http://localhost:3000";
  }

  async getCartBySignupToken(signupToken: string): Promise<CartDetails> {
    try {
      const url = new URL("/api/cart", this.baseUrl);
      url.searchParams.append("signup", signupToken);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Try to parse the error response, but fallback if it's not JSON
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // The response was not JSON, use the status text.
          throw new Error(response.statusText || "Failed to fetch cart");
        }
        throw new Error(
          errorData.error || errorData.message || "Failed to fetch cart"
        );
      }

      const data: CartApiResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.message || "Invalid response from cart API");
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching cart details:", error);
      throw error;
    }
  }
}

export const cartApiService = new CartApiService();
