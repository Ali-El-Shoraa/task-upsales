import { z } from "zod";

export const registerSchema = z.object({
  fallName: z.string().min(3, "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل"),
  email: z.string().email("صيغة البريد الإلكتروني غير صحيحة"),
  password: z.string().min(6, "كلمة السر يجب أن تكون 6 أحرف أو أكثر"),
  age: z.number().int().positive().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("صيغة البريد الإلكتروني غير صحيحة"),
  password: z.string().min(6, "كلمة السر يجب أن تكون 6 أحرف أو أكثر"),
});

// يمكنك إضافة المزيد من المخططات حسب الحاجة
