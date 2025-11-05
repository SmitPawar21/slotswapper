import Event from "../models/Event.js"
import SwapRequest from "../models/SwapRequest.js"

export const createSwapRequest = async (req, res) => {
  try {
    const { mySlotId, receiverSlotId } = req.body;

    const myEvent = await Event.findById(mySlotId);
    const receiverEvent = await Event.findById(receiverSlotId);

    // VALIDATIONS
    if (!myEvent || !receiverEvent)
      return res.status(404).json({ message: "One or both slots not found" });

    if (myEvent.status !== "SWAPPABLE" || receiverEvent.status !== "SWAPPABLE")
      return res.status(400).json({ message: "Both slots must be SWAPPABLE" });

    if (String(myEvent.userId) === String(receiverEvent.userId))
      return res.status(400).json({ message: "Cannot swap with your own slot" });

    const swapRequest = await SwapRequest.create({
      requesterId: myEvent.userId,
      receiverId: receiverEvent.userId,
      requesterEventId: mySlotId,
      receiverEventId: receiverSlotId,
      status: "PENDING"
    });

    await Event.updateMany(
      { _id: { $in: [mySlotId, receiverSlotId] } },
      { $set: { status: "SWAP_PENDING" } }
    )

    // TODO: send notification for receiverEvent.userId

    res.status(201).json({
      message: "Swap request created successfully",
      swapRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating swap request", error });
  }
}

export const respondToSwapRequest = async (req, res) => {
  try {
    const { accepted, requestId } = req.body;

    const request = await SwapRequest.findOne({requesterId: requestId})
      .populate("requesterEventId")
      .populate("receiverEventId");

    console.log("Respond controller me user: ", request);

    if (!request)
      return res.status(404).json({ message: "Swap request not found" });

    const requesterEvent = request.requesterEventId;
    const receiverEvent = request.receiverEventId;

    console.log(requesterEvent)

    if (accepted === "true") {

      const tempStart = requesterEvent.startTime;
      requesterEvent.startTime = receiverEvent.startTime;
      receiverEvent.startTime = tempStart;

      const tempEnd = requesterEvent.endTime;
      requesterEvent.endTime = receiverEvent.endTime;
      receiverEvent.endTime = tempEnd;

      requesterEvent.status = "BUSY";
      receiverEvent.status = "BUSY";

      request.status = "ACCEPTED";

      await requesterEvent.save();
      await receiverEvent.save();
      await request.save();

      return res.json({ message: "Swap accepted successfully" });
    } else {

      await Event.updateMany(
        { _id: { $in: [requesterEvent._id, receiverEvent._id] } },
        { $set: { status: "SWAPPABLE" } }
      );

      request.status = "REJECTED";
      await request.save();

      return res.json({ message: "Swap request rejected" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error processing swap response", error });
  }
}

export const getSwapPendingSlots = async (req, res) => {
  try {
    const userId = req.user.id;
  
    const swapRequests = await SwapRequest.find({receiverId: userId})
      .populate("requesterEventId")
      .populate("receiverEventId")
      .populate("requesterId")
  
    return res.status(201).json(swapRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error processing swap response", error });
  }
}