import express from "express";
import { registerUser } from "./auth.js";

const router = express.Router();

router.post("/register", registerUser);

export default router;
