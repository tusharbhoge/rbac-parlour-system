import { NextFunction, Request, Response } from "express";
import {prisma} from "../lib/prisma"
import { createEmployeeInput, updateEmployeeInput } from "@repo/common/types";

export const getEmployees = async ( req: Request, res: Response, next:NextFunction) => {
  try{
      const employees = await prisma.employee.findMany();
      res.json(employees);
  } catch(e){
      next(e);
  }
};

export const createEmployee = async (req: Request, res: Response, next:NextFunction ):Promise<any> => {
  const body = req.body;
  const { success } = createEmployeeInput.safeParse(body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid Inputs",
    });
  }
  
  try {
    const { name, email } = req.body;
    const newEmployee = await prisma.employee.create({
      data: { name, email },
    });
    res.status(201).json(newEmployee);
  } catch (e) {
    next(e);
  }
};

export const updateEmployee = async (req: Request, res: Response, next:NextFunction):Promise<any> => {
  const body = req.body;
  const { success } = updateEmployeeInput.safeParse(body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid Inputs",
    });
  }
  
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const updated = await prisma.employee.update({
      where: { id },
      data: { name, email },
    });
    res.json(updated);
  } catch (e) {
    next(e)
  }
};

export const deleteEmployee = async (req: Request, res: Response, next:NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.employee.delete({ where: { id } });
    res.json({ message: "Employee deleted" });
  } catch (e) {
    next(e);
  }
};
