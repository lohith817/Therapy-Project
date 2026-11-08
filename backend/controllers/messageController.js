const Message = require("../models/Message");

// @desc    Get chat history between logged-in user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    // Mark messages sent to me as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message (REST fallback; primary path is Socket.io)
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, fileUrl } = req.body;
    if (!receiverId || (!message && !fileUrl)) {
      return res.status(400).json({ success: false, message: "receiverId and message/fileUrl required" });
    }

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      message: message || "",
      fileUrl: fileUrl || "",
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getConversation, sendMessage };
