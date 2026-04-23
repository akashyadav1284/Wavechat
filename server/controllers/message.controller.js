import Message from "../models/Message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getMessages = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { userId: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: image || "",
    });

    await newMessage.save();

    // Real-time: send to receiver if online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      newMessage.delivered = true;
      await newMessage.save();
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { userId: senderId } = req.params;
    const myId = req.user._id;

    await Message.updateMany(
      { senderId, receiverId: myId, seen: false },
      { seen: true }
    );

    // Notify sender that messages are seen
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", { from: myId.toString() });
    }

    res.json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("Mark as seen error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
