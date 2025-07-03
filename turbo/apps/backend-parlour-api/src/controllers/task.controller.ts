import { Request, Response, NextFunction } from "express";
import {prisma} from "../lib/prisma"
import { createTaskInput, updateTaskInput } from "@repo/common/types";

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await prisma.task.findMany({
        include: {
            assignedTo: true,
        },
        });
        res.status(200).json(tasks);
    } catch (e) {
        next(e);
    }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const body = req.body;
    const { success } = createTaskInput.safeParse(body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid Inputs",
        });
    }
    try {
        const { title, description, employeeId } = req.body;
        const task = await prisma.task.create({
        data: {
            title,
            description,
            employeeId,
        },
        });
        res.status(201).json(task);
    } catch (e) {
        next(e);
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    const body = req.body;
    const { success } = updateTaskInput.safeParse(body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid Inputs",
        });
    }
    try {
        const { id } = req.params;
        const { title, description, isDone } = req.body;

        const task = await prisma.task.update({
        where: { id },
        data: {
            title,
            description,
            isDone,
        },
        });

        res.status(200).json(task);
    } catch (e) {
        next(e);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
