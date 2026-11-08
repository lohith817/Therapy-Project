const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  addSessionNotes,
} = require("../controllers/appointmentController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, authorizeRoles("client"), bookAppointment);
router.get("/my", authMiddleware, getMyAppointments);
router.patch("/:id/status", authMiddleware, authorizeRoles("therapist", "admin"), updateAppointmentStatus);
router.patch("/:id/notes", authMiddleware, authorizeRoles("therapist"), addSessionNotes);

module.exports = router;
