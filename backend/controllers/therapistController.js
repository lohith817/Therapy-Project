const Therapist = require("../models/Therapist");
const User = require("../models/User");

// @desc    Get all therapists with search/filter
// @route   GET /api/therapists
// @access  Public
// Query params: specialization, language, minFee, maxFee, minRating
const getTherapists = async (req, res) => {
  try {
    const { specialization, language, minFee, maxFee, minRating } = req.query;
    const filter = {};

    if (specialization) filter.specialization = { $in: [specialization] };
    if (language) filter.languages = { $in: [language] };
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (minFee || maxFee) {
      filter.sessionFee = {};
      if (minFee) filter.sessionFee.$gte = Number(minFee);
      if (maxFee) filter.sessionFee.$lte = Number(maxFee);
    }

    const therapists = await Therapist.find(filter)
      .populate("userId", "name email phone avatar")
      .sort({ rating: -1 });

    res.json({ success: true, count: therapists.length, therapists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single therapist profile
// @route   GET /api/therapists/:id
// @access  Public
const getTherapistById = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id).populate(
      "userId",
      "name email phone avatar"
    );
    if (!therapist) {
      return res.status(404).json({ success: false, message: "Therapist not found" });
    }
    res.json({ success: true, therapist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update therapist profile (self-service)
// @route   PUT /api/therapists/profile
// @access  Private (therapist)
const upsertMyProfile = async (req, res) => {
  try {
    const {
      qualification,
      experience,
      specialization,
      languages,
      sessionFee,
      availability,
      certifications,
      bio,
    } = req.body;

    let therapist = await Therapist.findOne({ userId: req.user._id });

    const payload = {
      qualification,
      experience,
      specialization,
      languages,
      sessionFee,
      availability,
      certifications,
      bio,
    };

    if (therapist) {
      therapist = await Therapist.findOneAndUpdate(
        { userId: req.user._id },
        payload,
        { new: true, runValidators: true }
      );
    } else {
      therapist = await Therapist.create({ userId: req.user._id, ...payload });
    }

    res.json({ success: true, therapist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin verifies a therapist
// @route   PATCH /api/therapists/:id/verify
// @access  Private (admin)
const verifyTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!therapist) {
      return res.status(404).json({ success: false, message: "Therapist not found" });
    }
    res.json({ success: true, therapist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTherapists,
  getTherapistById,
  upsertMyProfile,
  verifyTherapist,
};
