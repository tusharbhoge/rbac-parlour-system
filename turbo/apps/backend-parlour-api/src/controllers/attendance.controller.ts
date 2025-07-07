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

export const verifyEmployee = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const { email } = req.body;
    
    const employee = await prisma.employee.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const lastPunch = await prisma.attendanceLog.findFirst({
      where: { employeeId: employee.id },
      orderBy: { timestamp: 'desc' },
      select: { status: true }
    });

    res.json({
      ...employee,
      lastPunchStatus: lastPunch?.status || 'PUNCH_OUT', 
    });

  } catch (e) {
    next(e);
  }
};

export const handlePunch = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const { email } = req.body;
    
    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const lastPunch = await prisma.attendanceLog.findFirst({
      where: { employeeId: employee.id },
      orderBy: { timestamp: 'desc' },
      select: { status: true }
    });

    const currentStatus = lastPunch?.status || 'PUNCH_OUT';
    const newStatus = currentStatus === 'PUNCH_IN' ? 'PUNCH_OUT' : 'PUNCH_IN';

    const punchRecord = await prisma.attendanceLog.create({
      data: {
        employeeId: employee.id,
        status: newStatus,
        timestamp: new Date(),
      },
    });

    res.json({
      message: `Punched ${newStatus === 'PUNCH_IN' ? 'IN' : 'OUT'} successfully`,
      punchRecord,
    });

  } catch (e) {
    next(e);
  }
};