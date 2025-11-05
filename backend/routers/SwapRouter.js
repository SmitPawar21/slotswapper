import express from "express";
import { createSwapRequest, getSwapPendingSlots, respondToSwapRequest } from "../controllers/SwapController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/request', verifyToken, createSwapRequest);
router.post("/respond", verifyToken, respondToSwapRequest);
router.get('/pending-slots', verifyToken, getSwapPendingSlots);

export default router;