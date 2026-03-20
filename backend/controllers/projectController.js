const Project = require("../models/Project");
const ProjectJoinRequest = require("../models/ProjectJoinRequest");

// Create Project
const createProject = async (req, res) => {
  try {
    const { title, description, techStack, requiredSkills, status } = req.body;

    const newProject = new Project({
      title,
      description,
      techStack,
      requiredSkills,
      status,
      createdBy: req.userId,
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// Request to join project
const requestToJoinProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if user is already a member or owner
    const isMember = project.teamMembers?.some(id => id.toString() === req.userId);
    const isOwner = project.createdBy?.toString() === req.userId;

    if (isMember || isOwner) {
      return res.status(400).json({ message: "Already a member or owner" });
    }

    // Check if request already exists
    const existingReq = await ProjectJoinRequest.findOne({ project: projectId, user: req.userId });
    if (existingReq) {
      if (existingReq.status === "pending") return res.status(400).json({ message: "Request already pending" });
      if (existingReq.status === "approved") return res.status(400).json({ message: "Already approved" });
      // If rejected, re-apply by updating status back to pending
      existingReq.status = "pending";
      await existingReq.save();
      return res.status(200).json({ message: "Join request re-submitted", request: existingReq });
    }

    const joinReq = new ProjectJoinRequest({ user: req.userId, project: projectId });
    await joinReq.save();
    res.status(201).json({ message: "Join request submitted", request: joinReq });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get requests for a project (Admin only)
const getProjectJoinRequests = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const requests = await ProjectJoinRequest.find({ project: projectId, status: "pending" }).populate("user", "name email profilePic");
    res.json(requests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update request status (Approve/Reject)
const updateJoinRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    const joinReq = await ProjectJoinRequest.findById(requestId).populate("project");
    if (!joinReq) return res.status(404).json({ message: "Request not found" });

    if (joinReq.project.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    joinReq.status = status;
    await joinReq.save();

    if (status === "approved") {
      await Project.findByIdAndUpdate(joinReq.project._id, {
        $addToSet: { teamMembers: joinReq.user }
      });
    }

    res.json({ message: `Request ${status}`, request: joinReq });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get user's own requests
const getMyJoinRequests = async (req, res) => {
  try {
    const requests = await ProjectJoinRequest.find({ user: req.userId });
    res.json(requests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  requestToJoinProject,
  getProjectJoinRequests,
  updateJoinRequestStatus,
  getMyJoinRequests,
};