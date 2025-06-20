import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { cartApiService } from "@/services/cart/cart-api.service";
import { SignupForm } from "@/components/signup-form";

interface SignUpPageProps {
  params: Promise<{ signuptoken: string }>;
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { signuptoken } = await params;

  try {
    const cart = await cartApiService.getCartBySignupToken(signuptoken);

    if (!cart) {
      // This case should be handled by the error block, but as a fallback
      redirect(`${process.env.NEXT_PUBLIC_LANDING_URL}?error=invalid_token`);
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <SignupForm
            defaultEmail={cart.userDetails.email}
            planDetails={{
              name: cart.planDetails.plan,
              amount: cart.finalAmount,
              expiryDate: new Date(cart.expiryDate),
            }}
          />
        </div>
        <Toaster />
      </div>
    );
  } catch (error) {
    console.error("Error in signup page:", error);
    // The service throws an error for 404s, so we can catch it here.
    if (
      error instanceof Error &&
      (error.message.includes("Not Found") ||
        error.message.includes("Failed to fetch cart"))
    ) {
      redirect(`${process.env.NEXT_PUBLIC_LANDING_URL}?error=invalid_token`);
    }
    redirect(`${process.env.NEXT_PUBLIC_LANDING_URL}?error=server_error`);
  }
}
