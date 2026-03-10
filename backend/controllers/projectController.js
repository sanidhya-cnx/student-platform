const Project = require("../models/Project");
const User = require("../models/User");

exports.createProject = async (req, res) => {
  try {

    const project = new Project(req.body);

    const savedProject = await project.save();

    res.status(201).json(savedProject);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {

    const projects = await Project.find()
      .populate("creator")
      .populate("teamMembers");

    res.json(projects);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}