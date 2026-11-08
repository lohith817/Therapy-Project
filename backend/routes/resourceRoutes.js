const express = require("express");
const router = express.Router();
const { getResources, createResource } = require("../controllers/resourceController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getResources);
router.post("/", authMiddleware, authorizeRoles("admin", "therapist"), createResource);

module.exports = router;
