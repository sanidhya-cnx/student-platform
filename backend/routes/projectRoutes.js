const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const { createProject, getAllProjects } = require("../controllers/projectController");

// Create a new project
router.post("/create", verifyToken, createProject);
// get all projects
router.get("/all-projects", getAllProjects);

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

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { $addToSet: { teamMembers: req.userId } },
      { new: true }
    );

    res.status(200).json({ message: "Joined successfully", project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// leave project
router.post("/leave/:projectId", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // If the creator leaves, delete the project entirely
    if (project.createdBy && project.createdBy.toString() === req.userId) {
      await Project.findByIdAndDelete(req.params.projectId);
      return res.status(200).json({ message: "Project deleted successfully by owner" });
    }

    // Remove user from teamMembers using $pull to avoid validation crashes
    await Project.findByIdAndUpdate(
      req.params.projectId,
      { $pull: { teamMembers: req.userId } },
      { new: true }
    );

    res.status(200).json({ message: "Left project successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;