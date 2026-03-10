const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const {createProject, getAllProjects} = require('../controllers/projectController')

router.post("/create", createProject);
router.get("/all-projects", getAllProjects)
 
module.exports = router