const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    order: { type: Number, required: true },
    subTasks: [
      {
        title: { type: String, required: true },
        isCompleted: { type: Boolean, default: false }
      }
    ],
    comments: [
      {
        text: { type: String, required: true },
        user: { type: String, default: "User" },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);