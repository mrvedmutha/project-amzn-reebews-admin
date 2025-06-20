export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface User {
  _id: string;
  clerkId: string; // We'll use the Clerk ID as the main identifier
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
}
