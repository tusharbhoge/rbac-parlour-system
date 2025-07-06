import z, { string } from "zod";

//auth types
export const signinInput = z.object({
    email : z.string().email(),
    password : z.string().min(6),
})
export type SigninInput = z.infer<typeof signinInput>

// employee  (add, edit)
export const createEmployeeInput = z.object({
    name : z.string(),
    email : z.string().email()
})
export type CreateEmployeeInput =z.infer<typeof createEmployeeInput>

export const updateEmployeeInput = z.object({
    name : z.string().optional(),
    email : z.string().email().optional(),
    id : z.string()
})
export type UpdateEmployeeInput =z.infer<typeof updateEmployeeInput>

// task 
export const createTaskInput = z.object({
    title: z.string(),
    description: z.string().optional(),
    employeeId: z.string(),
    isDone: z.boolean()
})
export type CreateTaskInput =z.infer<typeof createTaskInput>

export const updateTaskInput = z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    employeeId: z.string().optional(),
    isDone: z.boolean().optional()
})
export type UpdateETaskInput =z.infer<typeof updateTaskInput>

