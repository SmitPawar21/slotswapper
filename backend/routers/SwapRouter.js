import express from "express";
import { createSwapRequest } from "../controllers/SwapController.js";

const router = express.Router();

router.post('/request', createSwapRequest);

export default router;