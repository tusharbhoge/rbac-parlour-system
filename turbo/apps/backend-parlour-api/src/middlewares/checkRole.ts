
import { Request, Response, NextFunction } from "express";

export function checkRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    if (roles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
}