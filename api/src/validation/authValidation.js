import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  email: z.string().trim().toLowerCase().email("Invalid email address"),

  phone_number: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signinSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});
