import * as z from "zod";

export const updateUserSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  lastname: z.string().min(1),
  phoneNumber: z.number(),
  address: z.string().min(1),
  city: z.string().min(1),
  category: z.enum(["developer", "handyman"]),
  avatar: z.string().optional(),
  examples: z.array(z.string()).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isComplete: z.boolean(),
});
