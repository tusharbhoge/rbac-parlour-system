import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return { status: 401, data: { message: "Invalid email" } };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { status: 401, data: { message: "Wrong password" } };

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return {
    status: 200,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
  };
};
