import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateInput =
  (schema: ZodSchema<any>, customMessage?: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: customMessage || "Invalid input",
        errors: customMessage ? undefined : result.error.format(), 
      });
      return;
    }

    req.body = result.data;
    next();
  };
