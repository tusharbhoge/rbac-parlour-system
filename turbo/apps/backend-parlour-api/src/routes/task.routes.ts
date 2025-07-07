import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRole } from "../middlewares/checkRole";
import { validateInput } from "../middlewares/validate.input";
import { createTaskInput, updateTaskInput } from "@repo/common/types";

const router = Router();

router.use(verifyToken as any); 

router.get("/", getTasks); 
router.post("/", checkRole(["SUPER_ADMIN"]), validateInput(createTaskInput),createTask);
router.put("/:id", checkRole(["SUPER_ADMIN"]), updateTask);
router.delete("/:id", checkRole(["SUPER_ADMIN"]), deleteTask);

export default router;
