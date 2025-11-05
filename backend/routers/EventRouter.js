import express from "express";
import { createEvent, getEventsByDate, getMyEvents, getSwappableSlots, mySwappableSlots, removeEvent, updateEvent } from "../controllers/EventController.js";
import verifyToken from "../middlewares/verifyToken.js";
const router = express.Router();

router.get('/my-events', verifyToken, getMyEvents);
router.post('/create', verifyToken, createEvent);
router.put('/update', verifyToken, updateEvent);
router.delete('/remove/:id', verifyToken, removeEvent);

router.get('/swappable-slots', verifyToken, getSwappableSlots);
router.get('/by-date', verifyToken, getEventsByDate);
router.get('/my-swappable-slots', verifyToken, mySwappableSlots);

export default router;