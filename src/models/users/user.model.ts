import mongoose from "mongoose";
import { userSchema } from "@/schemas/users/user.schema";
import { User as UserType } from "@/types/users/user.types";

// Check if the model is already defined before defining it to prevent recompilation errors
export const User =
  mongoose.models.User || mongoose.model<UserType>("User", userSchema);
