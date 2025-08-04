<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# How to Run the Project

> ملف الإرشادات هذا يوضّح طريقة إعداد البيئة وتشغيل الواجهة الأماميّة (Frontend)، الواجهة الخلفيّة (Backend) و Prisma Studio خطوة بخطوة، مع تأكيد ضرورة وجود **XAMPP** لتشغيل MySQL على المنفذ الصحيح.

## 1. المتطلبات المسبقة

| الأداة | الغرض | الإصدار المقترح |
| :-- | :-- | :-- |
| **Node.js** | تشغيل JavaScript/TypeScript | 20+ |
| **npm** أو **pnpm** | إدارة الحزم | يأتي مع Node |
| **XAMPP** | حزمة Apache-MySQL-PHP | 8.2+ |
| **Git** | جلب المستودع | 2.40+ |

> ⚠️ **تأكّد من أنّ MySQL في XAMPP يعمل على نفس المنفذ المحدَّد في ملف `.env` (عادةً 3306).**
> إذا كنت تستخدم منفذاً آخر (مثلاً 3307)، عدّل قيمة `DATABASE_URL` في كلٍّ من Frontend و Backend ثم أعد التشغيل.

## 2. استنساخ المستودع

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```


## 3. إعداد قاعدة البيانات (XAMPP + MySQL)

1. افتح **XAMPP Control Panel**.
2. ابدأ خدمة **MySQL** (تأكَّد من عدم وجود تعارض منافذ).
    - المنفذ الافتراضي: **3306**.
    - يمكنك تغييره من *Config → my.ini*.
3. أنشئ قاعدة بيانات فارغة (مثلاً `movies_db`) عبر phpMyAdmin أو سطر الأوامر:
```sql
CREATE DATABASE movies_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```


## 4. ملف البيئة `.env`

أنشئ ملف `.env` في مجلد **backend** يتضمّن القيم التالية (مثال):

```ini
# MySQL
DATABASE_URL="mysql://root:password@localhost:3306/movies_db"

# JWT
JWT_SECRET="super_secret_jwt"

# Cloudinary
CLOUDINARY_CLOUD_NAME="xxxx"
CLOUDINARY_API_KEY="yyyy"
CLOUDINARY_API_SECRET="zzzz"
```

> غيّر كلمة المرور أو المنفذ إذا لم تكن القيم الافتراضيّة مطابقة لإعداد XAMPP لديك.

## 5. تثبيت الاعتمادات

### Backend

```bash
cd backend
npm install
```

**أهم الحزم المثبَّتة**

- express, cors, cookie-parser
- prisma + @prisma/client
- bcryptjs, jsonwebtoken
- zod (للتـحقق من البيانات)
- multer, cloudinary


### Frontend

```bash
cd ../frontend
npm install
```

**أهم الحزم المثبَّتة**

- react, react-router-dom
- tailwindcss + @tailwindcss/vite
- zustand, @tanstack/react-query / react-table
- lucide-react, sonner
- zod + @hookform/resolvers


## 6. ترحيل قاعدة البيانات بـ Prisma

```bash
# من مجلد backend
npx prisma migrate dev --name init
npx prisma generate   # يُنشئ Prisma Client
```

> يمكنك معاينة البيانات عبر **Prisma Studio** لاحقاً.

## 7. تشغيل الخدمات (3 نوافذ Terminal)

| نافذة | المسار | الأمر | الوصف |
| :-- | :-- | :-- | :-- |
| **1** | `backend/` | `npm run dev` | يشغّل خادم Express على `localhost:4000` (أو المنفذ المعرّف في `package.json`) |
| **2** | `frontend/` | `npm run dev` | يشغّل Vite على `localhost:5173` (افتراضي) |
| **3** | `backend/` | `npx prisma studio` | يفتح Prisma Studio على `localhost:5555` لمعاينة الجداول |

## 8. تجربة التطبيق

1. افتح المتصفح على
`http://localhost:5173` → واجهة React.
2. ارفع صورة في صفحة إضافة فيلم لترى التكامل مع **Cloudinary**.
3. راقب سجلات Terminal للتأكّد من عدم وجود أخطاء JWT أو قاعدة البيانات.
4. افتح `http://localhost:5555` لتتحقّق من البيانات مباشرة في Prisma Studio.

## 9. نصائح وحلول شائعة

| المشكلة | الحل |
| :-- | :-- |
| **خطأ اتصال MySQL** | تأكّد من تشغيل MySQL في XAMPP وأنّ المنفذ واسم المستخدم وكلمة المرور مطابقة لـ `DATABASE_URL`. |
| **تعارض منافذ** | غيّر منفذ MySQL في XAMPP أو عدّل `DATABASE_URL`. غيّر منفذ Express عبر متغيّر بيئة مثل `PORT=5000`. |
| **تعذّر رفع صورة** | تحقّق من مفاتيح Cloudinary في `.env` ومن اتصال الإنترنت. |
| **Prisma Studio لا يظهر البيانات** | أعد تشغيله بعد `npx prisma generate` أو `npx prisma db pull`. |

## 10. أوامر مفيدة

```bash
# إنشاء مستخدم وهمي
curl -X POST http://localhost:4000/api/auth/register -d '{"email":"test@test.com", "password":"123456", "fallName":"Test User"}'

# إدخال 100 فيلم تجريبي عبر Script SQL
mysql -u root -p movies_db < seed-movies.sql
```

> ✨ **مبروك!** الآن أصبح المشروع يعمل بكامل مكوّناته على جهازك المحلي. تأكّد دائماً من تزامن منافذ XAMPP و `.env` لتجنّب أي تعارض.

