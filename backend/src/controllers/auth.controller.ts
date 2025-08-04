import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { loginSchema, registerSchema } from "../schemas/zod.schema.ts";
import { generateToken } from "../libs/generateToken.ts";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return res.status(400).json({ message: firstError.message });
    }
    const { fallName, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { fallName, email, password: hashedPassword, profilePic: "" },
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        fallName: user.fallName,
        email: user.email,
        profilePic: "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "There was a registration error." });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return res.status(400).json({ message: firstError.message });
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = generateToken(user.id);

    return res.json({
      // message:,
      token,
      user: {
        id: user.id,
        fallName: user.fallName,
        email: user.email,
        profilePic: "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "There was an error logging in." });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    return res.json({
      message:
        "Logged out successfully. Please delete your token on client side.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while logging out." });
  }
};

export const checkAuth = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user logged in" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    return res.status(200).json({
      message: "User authenticated",
      token,
      user: existingUser,
    });
  } catch (error: any) {
    console.error("Error in checkAuth controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
