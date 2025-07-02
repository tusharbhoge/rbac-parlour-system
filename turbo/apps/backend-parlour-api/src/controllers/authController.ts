import { Request, Response } from "express";
import { loginService } from "../services/authService";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);
  res.status(result.status).json(result.data);
};
