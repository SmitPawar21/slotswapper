import Event from "../models/Event.js";

export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ userId })
      .sort({ startTime: 1 }) 
      .lean();
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, startTime, endTime, status } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Title, start time, and end time are required",
      });
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const event = await Event.create({
      title,
      description,
      startTime,
      endTime,
      status: status || "BUSY",
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, title, description, startTime, endTime, status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const event = await Event.findOne({ _id: id, userId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you don't have permission to update it",
      });
    }

    const newStartTime = startTime ? new Date(startTime) : event.startTime;
    const newEndTime = endTime ? new Date(endTime) : event.endTime;

    if (newEndTime <= newStartTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    if (startTime || endTime) {
      const overlappingEvent = await Event.findOne({
        userId,
        _id: { $ne: id },
        $or: [
          {
            startTime: { $lt: newEndTime },
            endTime: { $gt: newStartTime },
          },
        ],
      });

      if (overlappingEvent) {
        return res.status(409).json({
          success: false,
          message: "Updated times overlap with another event",
        });
      }
    }

    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (status) event.status = status;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

export const removeEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const event = await Event.findOneAndDelete({ _id: id, userId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you don't have permission to delete it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

export const getSwappableSlots = async (req, res) => {
  const userId = req.user.id;

  try {
    const events = await Event.find({
      status: "SWAPPABLE",
      userId: {$ne: userId}
    }).populate("userId", "name email");

    res.status(201).json(events);
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
}