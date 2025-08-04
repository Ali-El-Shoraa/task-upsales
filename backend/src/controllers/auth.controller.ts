import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { loginSchema, registerSchema } from "../schemas/zod.schema.ts";
import { generateToken } from "../libs/generateToken.ts";

const prisma = new PrismaClient();

// أنواع خاصة بالـRequest مع بيانات المستخدم
interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // التحقق من البيانات بالـZod
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return res.status(400).json({ message: firstError.message });
    }
    const { fallName, email, password } = parsed.data;

    // التأكد من أن البريد غير موجود مسبقًا
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "البريد الإلكتروني مستخدم بالفعل" });
    }

    // تشفير كلمة السر
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: { fallName, email, password: hashedPassword, profilePic: "" },
    });

    // توليد التوكن
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
    return res.status(500).json({ message: "حدث خطأ في التسجيل" });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    // التحقق من البيانات
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return res.status(400).json({ message: firstError.message });
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "البريد الإلكتروني أو كلمة السر خاطئة" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "البريد الإلكتروني أو كلمة السر خاطئة" });
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
    return res.status(500).json({ message: "حدث خطأ في تسجيل الدخول" });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // لكي تكون آمنًا، بعض الأنظمة تحذف التوكن من جهة العميل فقط (عادة عبر الريأكت أو الـfrontend)
    // يمكنك هنا إرسال رسالة تأكيد فقط
    return res.json({
      message:
        "Logged out successfully. Please delete your token on client side.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء تسجيل الخروج" });
  }
};

// تعريف نوع Request مخصص يحتوي على user ضمنه
interface AuthenticatedUser {
  id: number;
  fallName: string;
  email: string;
  profilePic?: string;
  createdAt: Date;
}

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

    // استخرج التوكن من هيدر Authorization المرسَل مع الطلب (إن وجد)
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
