import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { validateInput } from "../middlewares/validate.input";
import { signinInput } from "@repo/common/types";

const router = Router();

router.post("/login", validateInput(signinInput), login);

export default router;
