import { Request, Response, NextFunction } from "express";

export const checkRole = (roles: ("ADMIN" | "SUPER_ADMIN")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
