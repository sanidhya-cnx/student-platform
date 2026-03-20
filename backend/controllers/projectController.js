const Project = require("../models/Project");

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



module.exports = {
  createProject,
  getAllProjects,
};