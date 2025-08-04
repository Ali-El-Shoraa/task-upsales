import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  fallName: z.string(),
  email: z.string().email(),
  profilePic: z.string().optional(),
  createdAt: z.string(),
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});
