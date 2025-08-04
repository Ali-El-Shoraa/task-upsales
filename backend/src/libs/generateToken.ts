import jwt from "jsonwebtoken";

const TOKEN_EXPIRES_IN = "3d";

export const generateToken = (userId: number): string => {
  const JWT_SECRET = process.env.JWT_SECRET!;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};
