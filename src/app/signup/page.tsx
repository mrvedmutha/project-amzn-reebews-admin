import { redirect } from "next/navigation";

// This component will never be rendered.
// It exists only to handle the redirect for the /signup route.
export default function SignUpRedirectPage() {
  redirect("https://reebews.com");
}
