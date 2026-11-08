const express = require("express");
const router = express.Router();
const { getConversation, sendMessage } = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/:userId", authMiddleware, getConversation);
router.post("/", authMiddleware, sendMessage);

module.exports = router;
