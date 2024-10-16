import { getReceiverSocketId, io } from "../index.js";
import Conversation from "../models/conservation.model.js";
import Message from "../models/message.model.js";

export const sendmessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;
      let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message ({
      senderId,
      receiverId,
      message,
    });
    if(newMessage){

    conversation.message.push(newMessage._id);
}
    await Promise.all([conversation.save(), newMessage.save()]);
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};
export const getmessage = async(req, res, next) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.id;
        
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('message');
        
        if (!conversation) {
            console.log("No conversation found");
            return res.status(404).json([]);
        }
    
        res.status(200).json(conversation.message);
        
    } catch (error) {
        next(error);
    }
}

