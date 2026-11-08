const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stressLevel: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    anxietyLevel: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    depressionLevel: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    moodRating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
