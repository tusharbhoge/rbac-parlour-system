import { Request, Response, NextFunction } from "express";
import {prisma} from "../lib/prisma"

export const getAttendanceLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await prisma.attendanceLog.findMany({
      include: { employee: true },
      orderBy: { timestamp: "desc" },
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
