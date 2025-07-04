import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRole } from "../middlewares/checkRole"; 
import { validateInput } from "../middlewares/validate.input";
import { createEmployeeInput, updateEmployeeInput } from "@repo/common/types";

const router = Router();

router.use(verifyToken as any);

router.get("/", getEmployees); 
router.post("/", checkRole(["SUPER_ADMIN"]), validateInput(createEmployeeInput), createEmployee);
router.put("/:id", checkRole(["SUPER_ADMIN"]), validateInput(updateEmployeeInput), updateEmployee);
router.delete("/:id", checkRole(["SUPER_ADMIN"]), deleteEmployee);

export default router;
