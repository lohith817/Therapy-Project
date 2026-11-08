const express = require("express");
const router = express.Router();
const {
  getTherapists,
  getTherapistById,
  upsertMyProfile,
  verifyTherapist,
} = require("../controllers/therapistController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getTherapists);
router.get("/:id", getTherapistById);
router.put("/profile", authMiddleware, authorizeRoles("therapist"), upsertMyProfile);
router.patch("/:id/verify", authMiddleware, authorizeRoles("admin"), verifyTherapist);

module.exports = router;
