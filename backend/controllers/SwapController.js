import Event from "../models/Event.js"
import SwapRequest from "../models/SwapRequest.js"

export const createSwapRequest = async (req, res) => {
  try {
    const {mySlotId, receiverSlotId} = req.body;

    const myEvent = await Event.findById(mySlotId);
    const receiverEvent = await Event.findById(receiverSlotId);

    // VALIDATIONS
    if(!myEvent || !receiverEvent) 
        return res.status(404).json({ message: "One or both slots not found" });
   
    if (myEvent.status !== "SWAPPABLE" || theirEvent.status !== "SWAPPABLE")
      return res.status(400).json({ message: "Both slots must be SWAPPABLE" });
   
    if (String(myEvent.userId) === String(theirEvent.userId))
      return res.status(400).json({ message: "Cannot swap with your own slot" });

    const swapRequest = await SwapRequest.create({
        requesterId: myEvent.userId,
        receiverId: receiverEvent.userId,
        requesterEventId: mySlotId,
        receiverEventId: receiverSlotId,
        status: "PENDING"
    });

    await Event.updateMany(
      {_id: {$in: [mySlotId, receiverSlotId]}},
      {$set: {status: "SWAP_PENDING"}}
    )

    // TODO: send notification for receiverEvent.userId

    res.status(201).json({
      message: "Swap request created successfully",
      swapRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating swap request", error });
  }
}