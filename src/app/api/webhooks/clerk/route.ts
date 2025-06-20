import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/database/db";
import { User } from "@/models/users/user.model";
import { cartService } from "@/services/cart/cart.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  try {
    await dbConnect();

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, public_metadata } =
        evt.data;

      const signupToken = public_metadata.signupToken as string;

      if (!signupToken) {
        // This could happen if a user signs up through a different flow
        // We can either ignore it or create a user without cart details
        console.warn(`User created without signupToken: ${id}`);
        // For now, we will not create a local user record without cart details.
        return NextResponse.json(
          {
            success: true,
            message:
              "User created in Clerk, but no signup token found. Local user not created.",
          },
          { status: 200 }
        );
      }

      const cart = await cartService.getCartBySignupToken(signupToken);

      if (!cart) {
        console.error(`Cart not found for signupToken: ${signupToken}`);
        return NextResponse.json(
          { success: false, message: "Cart not found for user." },
          { status: 404 }
        );
      }

      const newUser = await User.create({
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        address: cart.userDetails.address,
      });

      return NextResponse.json({
        success: true,
        message: "User created",
        data: newUser,
      });
    }

    if (eventType === "user.updated") {
      const { id, first_name, last_name } = evt.data;
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          firstName: first_name,
          lastName: last_name,
        },
        { new: true }
      );
      return NextResponse.json({
        success: true,
        message: "User updated",
        data: updatedUser,
      });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      await User.findOneAndDelete({ clerkId: id });
      return NextResponse.json({
        success: true,
        message: "User deleted",
      });
    }

    return new Response("", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
