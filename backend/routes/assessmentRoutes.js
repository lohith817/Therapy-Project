const express = require("express");
const router = express.Router();
const {
  submitAssessment,
  getMyAssessments,
  getClientAssessments,
} = require("../controllers/assessmentController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, authorizeRoles("client"), submitAssessment);
router.get("/my", authMiddleware, getMyAssessments);
router.get("/client/:clientId", authMiddleware, authorizeRoles("therapist", "admin"), getClientAssessments);

module.exports = router;
