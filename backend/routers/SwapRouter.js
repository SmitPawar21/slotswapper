import express from "express";
import { createSwapRequest, respondToSwapRequest } from "../controllers/SwapController.js";

const router = express.Router();

router.post('/request', createSwapRequest);
router.post("/respond", respondToSwapRequest);

export default router;