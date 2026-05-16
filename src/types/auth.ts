export type SignUpBody = {
  email: string;
  password: string;
};

export type SignInBody = SignUpBody;

export type UpdateUser = {
  userId: string;
  name: string;
  lastname: string;
  phoneNumber: number;
  address: string;
  city: string;
  category: "developer" | "handyman";
  avatar: string | undefined;
  examples: string[];
  createdAt: Date;
  updatedAt: Date;
  isComplete: boolean;
};
