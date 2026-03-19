const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const { createProject, getAllProjects } = require("../controllers/projectController");

// Create a new project
router.post("/create", verifyToken, createProject);

// Get logged-in user's projects
router.get("/my-projects", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({
  $or: [
    { createdBy: req.userId },
    { teamMembers: req.userId }
  ]
});
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/join/:projectId", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Prevent duplicate joining
    if (project.teamMembers.some(id => id.toString() === req.userId)) {
      return res.status(400).json({ message: "Already joined" });
    }

    project.teamMembers.push(req.userId);
    await project.save();

    res.status(200).json({ message: "Joined successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/all-projects", getAllProjects);

// leave project
router.post("/leave/:projectId", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove user from teamMembers
    project.teamMembers = project.teamMembers.filter(
      (id) => id.toString() !== req.userId
    );

    await project.save();

    res.status(200).json({ message: "Left project successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;