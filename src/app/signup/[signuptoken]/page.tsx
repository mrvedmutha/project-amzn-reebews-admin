import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { cartService } from "@/services/cart/cart.service";
import { SignupForm } from "@/components/signup-form";

interface SignUpPageProps {
  params: Promise<{ signuptoken: string }>;
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { signuptoken } = await params;

  try {
    const cart = await cartService.findBySignupToken(signuptoken);

    if (!cart) {
      redirect(`${process.env.NEXT_PUBLIC_LANDING_URL}?error=invalid_token`);
    }

    // Calculate expiry date based on plan type
    const durationInDays = cart.planDetails.plan === "yearly" ? 365 : 30;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <SignupForm
            defaultEmail={cart.userDetails.email}
            planDetails={{
              name: cart.planDetails.plan,
              amount: cart.planDetails.amount,
              expiryDate: new Date(
                Date.now() + durationInDays * 24 * 60 * 60 * 1000
              ),
            }}
          />
        </div>
        <Toaster />
      </div>
    );
  } catch (error) {
    console.error("Error in signup page:", error);
    redirect(`${process.env.NEXT_PUBLIC_LANDING_URL}?error=server_error`);
  }
}
