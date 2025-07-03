import { Router } from "express";
import { getAttendanceLogs } from "../controllers/attendance.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken as any);

router.get("/", getAttendanceLogs); 
export default router;