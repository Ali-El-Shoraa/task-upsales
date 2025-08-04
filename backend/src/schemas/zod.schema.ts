import { z } from "zod";

export const registerSchema = z.object({
  fallName: z.string().min(3, "Username must contain at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be 6 characters or more"),
  age: z.number().int().positive().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be 6 characters or more"),
});
