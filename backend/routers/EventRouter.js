import express from "express";
import { createEvent, getMyEvents, removeEvent, updateEvent } from "../controllers/EventController.js";
const router = express.Router();

router.get('/my-events', getMyEvents);
router.post('/create', createEvent);
router.put('/update', updateEvent);
router.delete('/remove/:id', removeEvent);

export default router;