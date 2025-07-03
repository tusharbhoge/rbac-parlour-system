import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRole } from "../middlewares/checkRole"; 

const router = Router();

router.use(verifyToken as any);

router.get("/", getEmployees); 
router.post("/", checkRole(["SUPER_ADMIN"]), createEmployee);
router.put("/:id", checkRole(["SUPER_ADMIN"]), updateEmployee);
router.delete("/:id", checkRole(["SUPER_ADMIN"]), deleteEmployee);

export default router;
