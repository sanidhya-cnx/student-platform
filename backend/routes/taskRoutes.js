const express = require("express");
const router = express.Router({ mergeParams: true }); // Important: to access :projectId if mounted via projects route
const { verifyToken } = require("../middleware/authMiddleware");

const {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require("../controllers/taskController");

// Instead of passing verifyToken on every single one, we can do router.use
router.use(verifyToken);

// Using projectId from params where we mount this route (e.g. /api/projects/:projectId/tasks)
router.get("/", getTasksByProject);
router.post("/", createTask);
router.put("/reorder", reorderTasks);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

module.exports = router;
