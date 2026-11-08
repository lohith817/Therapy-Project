const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    startTime: { type: String, required: true }, // e.g. "09:00"
    endTime: { type: String, required: true }, // e.g. "17:00"
  },
  { _id: false }
);

const therapistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: Number, // years
      required: true,
      min: 0,
    },
    specialization: [
      {
        type: String,
        enum: [
          "Depression",
          "Anxiety",
          "Relationship Counseling",
          "Trauma Therapy",
          "Child Counseling",
          "Career Counseling",
        ],
      },
    ],
    languages: [{ type: String }],
    sessionFee: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: [availabilitySchema],
    certifications: [{ type: String }],
    bio: { type: String, default: "" },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Therapist", therapistSchema);
