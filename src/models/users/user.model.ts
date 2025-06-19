import { model, models } from "mongoose";
import { User } from "@/types/users/user.types";
import { UserSchema } from "@/schemas/users/user.schema";

export const UserModel = models.User || model<User>("User", UserSchema);
