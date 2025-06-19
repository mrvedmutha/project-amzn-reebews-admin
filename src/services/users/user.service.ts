import { User } from "@/types/users/user.types";
import { UserModel } from "@/models/users/user.model";
import { hash } from "bcryptjs";

interface CreateUserInput {
  email: string;
  password?: string;
  name?: string;
  authProvider?: "email" | "google";
  planName: string;
  planAmount: number;
  planExpiryDate: Date;
}

class UserService {
  async createUser({
    email,
    password,
    name,
    authProvider = "email",
    planName,
    planAmount,
    planExpiryDate,
  }: CreateUserInput): Promise<User> {
    const hashedPassword = password ? await hash(password, 10) : undefined;

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      name,
      authProvider,
      planDetails: {
        name: planName,
        amount: planAmount,
        purchaseDate: new Date(),
        expiryDate: planExpiryDate,
        addOns: [],
      },
      purchaseHistory: [
        {
          id: Date.now().toString(),
          type: "plan",
          name: planName,
          description: `Initial ${planName} plan purchase`,
          amount: planAmount,
          purchaseDate: new Date(),
          status: "completed",
        },
      ],
      products: [],
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email });
  }

  async addPlanAddOn(
    userId: string,
    addOn: Omit<User["planDetails"]["addOns"][0], "status" | "purchaseDate">
  ) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    user.planDetails.addOns.push({
      ...addOn,
      status: "active",
      purchaseDate: new Date(),
    });

    user.purchaseHistory.push({
      id: Date.now().toString(),
      type: "addon",
      name: addOn.name,
      description: addOn.description,
      amount: addOn.price,
      currency: addOn.currency,
      purchaseDate: new Date(),
      status: "completed",
    });

    return user.save();
  }

  async addProduct(
    userId: string,
    product: Omit<User["products"][0], "status" | "createdAt" | "updatedAt">
  ) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const now = new Date();
    user.products.push({
      ...product,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    return user.save();
  }
}

export const userService = new UserService();
