const Task = require("../models/Task");

// Get all tasks for a specific project
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId }).sort({ order: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Find highest order in the column
    const status = req.body.status || "To Do";
    const highestTask = await Task.findOne({ project: projectId, status }).sort({ order: -1 });
    const order = highestTask ? highestTask.order + 1000 : 1000;

    const taskData = {
      ...req.body,
      status,
      project: projectId,
      order,
    };
    if (!taskData.assignTo) delete taskData.assignTo;

    const newTask = new Task(taskData);
    await newTask.save();
    
    // Emit socket event globally
    req.io.to(`project-${projectId}`).emit("taskCreated", newTask);

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task API:", error);
    res.status(500).json({ message: "Error creating task", error });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = { ...req.body };
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.__v;
    delete updates.project; // Should not change project via task edit implicitly

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    // Emit socket event globally
    req.io.to(`project-${updatedTask.project}`).emit("taskUpdated", updatedTask);

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task API:", error);
    res.status(500).json({ message: "Error updating task", error });
  }
};

// Reorder tasks
exports.reorderTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { updates } = req.body; // Array of { _id, status, order }

    // Bulk update approach for efficiency
    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update._id },
        update: { $set: { status: update.status, order: update.order } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    // Emit socket event
    req.io.to(`project-${projectId}`).emit("tasksReordered", updates);

    res.status(200).json({ message: "Tasks reordered successfully" });
  } catch (error) {
    console.error("Reorder Error:", error);
    res.status(500).json({ message: "Error reordering tasks", error });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Emit socket event globally
    req.io.to(`project-${task.project}`).emit("taskDeleted", taskId);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
