import { Router } from "express";
import { 
  getAttendanceLogs, 
  verifyEmployee,
  handlePunch 
} from "../controllers/attendance.controller";
import { validateInput } from "../middlewares/validate.input";
import { z } from "zod";


const verifyEmployeeSchema = z.object({
  email: z.string().email()
});
const punchSchema = z.object({
  email: z.string().email()
});

const router = Router();


// Routes
router.get("/", getAttendanceLogs); 
router.post("/verify", validateInput(verifyEmployeeSchema), verifyEmployee);
router.post("/punch", validateInput(punchSchema), handlePunch);

export default router;