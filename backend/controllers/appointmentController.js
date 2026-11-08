const Appointment = require("../models/Appointment");
const crypto = require("crypto");

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (client)
const bookAppointment = async (req, res) => {
  try {
    const { therapistId, appointmentDate, startTime, duration } = req.body;

    if (!therapistId || !appointmentDate || !startTime) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Generate a mock secure video meeting link (room id) for the session
    const roomId = crypto.randomBytes(8).toString("hex");
    const videoLink = `${process.env.CLIENT_URL}/session/${roomId}`;

    const appointment = await Appointment.create({
      clientId: req.user._id,
      therapistId,
      appointmentDate,
      startTime,
      duration: duration || 45,
      videoLink,
    });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user's appointments (client or therapist)
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const filter =
      req.user.role === "therapist"
        ? { therapistId: req.user._id }
        : { clientId: req.user._id };

    const appointments = await Appointment.find(filter)
      .populate("clientId", "name email")
      .populate("therapistId", "name email")
      .sort({ appointmentDate: -1 });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status (confirm/cancel/complete)
// @route   PATCH /api/appointments/:id/status
// @access  Private (therapist/admin)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { sessionStatus } = req.body;
    const allowed = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (!allowed.includes(sessionStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { sessionStatus },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add session notes after a session
// @route   PATCH /api/appointments/:id/notes
// @access  Private (therapist)
const addSessionNotes = async (req, res) => {
  try {
    const { sessionNotes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { sessionNotes },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  addSessionNotes,
};
