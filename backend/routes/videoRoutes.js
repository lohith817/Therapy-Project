const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const { authMiddleware } = require("../middleware/authMiddleware");

// @desc    Generate a Twilio Video access token for a given room (appointment)
// @route   GET /api/video/token/:roomName
// @access  Private
router.get("/token/:roomName", authMiddleware, (req, res) => {
  try {
    const { roomName } = req.params;
    const { AccessToken } = twilio.jwt;
    const { VideoGrant } = AccessToken;

    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_API_KEY_SID) {
      return res.status(500).json({
        success: false,
        message: "Twilio credentials are not configured on the server (.env)",
      });
    }

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY_SID,
      process.env.TWILIO_API_KEY_SECRET,
      { identity: req.user._id.toString() }
    );

    token.addGrant(new VideoGrant({ room: roomName }));

    res.json({ success: true, token: token.toJwt(), identity: req.user._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
