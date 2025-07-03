import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signinInput } from "@repo/common/types";

export  const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const body = req.body;
  const { success } = signinInput.safeParse(body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid Inputs",
    });
  }

  try {
    const { email, password } = body;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user){
      return res.status(401).json({
        message: "Invalid email or password",
      })
      };
    const match = user && (await bcrypt.compare(password, user.password));
    if (!match){
      return res.status(401).json({
        message: "Invalid email or password",
      })
      };
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({
        message: "JWT secret not configured",
      });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
    console.error(e);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
