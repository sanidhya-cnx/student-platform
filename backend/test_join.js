require('dotenv').config();
const mongoose = require("mongoose");
const Project = require("./models/Project");
const ProjectJoinRequest = require("./models/ProjectJoinRequest");

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const project = await Project.findOne();
    if(!project) { console.log("No project"); return; }
    
    const reqUserId = new mongoose.Types.ObjectId().toString();
    const isMember = project.teamMembers?.some(id => id.toString() === reqUserId);
    const isOwner = project.createdBy?.toString() === reqUserId;

    const existingReq = await ProjectJoinRequest.findOne({ project: project._id, user: reqUserId });
    
    const joinReq = new ProjectJoinRequest({ user: reqUserId, project: project._id });
    await joinReq.save();
    console.log("Successfully saved JoinRequest");
  } catch(e) {
    console.error("ERROR", e);
  } finally {
    mongoose.disconnect();
  }
}
test();
