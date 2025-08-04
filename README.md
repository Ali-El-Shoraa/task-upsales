# How to Run the Project

>This tutorial explains how to set up the environment and run the frontend, backend, and Prisma Studio step by step, emphasizing that XAMPP is required to run MySQL on the correct port.

##1. Prerequisites

|Tool | Purpose | Proposed Version |
| :-- | :-- | :-- |
| **Node.js** | Run JavaScript/TypeScript | 20+ |
| **npm** or **pnpm** | Package Manager | Comes with Node |
| **XAMPP** | Apache-MySQL-PHP Package | 8.2+ |
| **Git** | Fetch Repository | 2.40+ |

>⚠️ **Make sure MySQL in XAMPP is running on the same port specified in the `.env` file (usually 3306).**
> If you're using a different port (e.g., 3307), modify the `DATABASE_URL` value in both the Frontend and Backend and restart.

##2. Clone the repository

```bash
git clone https://github.com/Ali-El-Shoraa/task-upsales.git
cd task-upsales
```

## 3. Database Setup (XAMPP + MySQL)

1. Open the XAMPP Control Panel.
2. Start the MySQL service (make sure there are no port conflicts).
- Default port: 3306.
- You can change it from *Config → my.ini*.
3. Create an empty database (e.g., `movies_db`) via phpMyAdmin or the command line:

```sql
CREATE DATABASE movies_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 4. Environment File `.env`

Create a `.env` file in the **backend** folder containing the following values (example):

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
> Change the password or port if the default values don't match your XAMPP setup.

##5. Installing Credentials

### Backend

```bash
cd backend
npm install
```

**Most important installed packages**

- express, cors, cookie-parser
- prisma + @prisma/client
- bcryptjs, jsonwebtoken
- zod (To verify data)
- multer, cloudinary


### Frontend

```bash
cd ../frontend
npm install
```

**Most important installed packages**

- react, react-router-dom
- tailwindcss + @tailwindcss/vite
- zustand, @tanstack/react-query / react-table
- lucide-react, sonner
- zod + @hookform/resolvers

## 6. Migrate the database with Prisma

```bash
# From a volume backend
npx prisma migrate dev --name init
npx prisma generate   # create Prisma Client
```
> You can preview the data via **Prisma Studio** later.

## 7. Starting Services (3 Terminal Windows)

| Window | Path | Command | Description |
| :-- | :-- | :-- | :-- |
| **1** | `backend/` | `npm run dev` | Runs Express Server on `localhost:4000` (or the port defined in `package.json`) |
| **2** | `frontend/` | `npm run dev` | Runs Vite on `localhost:5173` (default) |
| **3** | `backend/src` | `npx prisma studio` | Opens Prisma Studio on `localhost:5555` to preview the tables |## 8. Testing the App

1. Open your browser at
`http://localhost:5173` → the React interface.
2. Upload an image to the Add Movie page to see the integration with **Cloudinary**.
3. Monitor the Terminal logs for JWT or database errors.
4. Open `http://localhost:5555` to check the data directly in Prisma Studio.

## 9. Common Tips and Solutions

| Problem | Solution |
| :-- | :-- || **MySQL Connection Error** | Make sure MySQL is running in XAMPP and that the port, username, and password match `DATABASE_URL`. |
| **Port Conflict** | Change the MySQL port in XAMPP or modify `DATABASE_URL`. Change the Express port via an environment variable such as `PORT=5000`. |
| **Unable to Upload Image** | Check the Cloudinary keys in `.env` and your internet connection. |
| **Prisma Studio Not Showing Data** | Restart it after `npx prisma generate` or `npx prisma db pull`. |

## 10. Login Data for Testing

If you would like to test the system using a ready-made account:

- **Email:** `kaaed@example.com`
- **Password:** `123456`

> You can use this data to log in and test the features available to users.
