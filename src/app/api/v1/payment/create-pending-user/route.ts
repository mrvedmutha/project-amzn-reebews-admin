import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api/responses";
import { withApiKeyAuth } from "@/lib/auth/api-key-middleware";

/**
 * Create pending user after successful payment
 * This endpoint is called by the landing page server after payment
 * Requires API key with PAYMENT_FLOW permission
 */
async function createPendingUserHandler(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { email, name, planType } = body;
    
    if (!email || !name || !planType) {
      return errorResponse("Missing required fields: email, name, planType", 400);
    }

    // TODO: Implement your pending user creation logic here
    // This could involve:
    // - Creating a pending user record in database
    // - Sending confirmation email
    // - Setting up payment intent
    // - etc.
    
    console.log("Creating pending user:", { email, name, planType });
    
    // Mock response for now
    const pendingUser = {
      id: "pending_" + Date.now(),
      email,
      name,
      planType,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    return successResponse("Pending user created successfully", 201, pendingUser);
  } catch (error) {
    console.error("Error creating pending user:", error);
    return errorResponse("Failed to create pending user", 500, error);
  }
}

// Export the protected handler
export const POST = withApiKeyAuth(createPendingUserHandler); 