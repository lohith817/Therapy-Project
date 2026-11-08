const Resource = require("../models/Resource");

// @desc    Get all resources (optionally filter by type/category)
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;

    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private (admin/therapist)
const createResource = async (req, res) => {
  try {
    const { title, type, content, mediaUrl, category } = req.body;
    const resource = await Resource.create({
      title,
      type,
      content,
      mediaUrl,
      category,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getResources, createResource };
