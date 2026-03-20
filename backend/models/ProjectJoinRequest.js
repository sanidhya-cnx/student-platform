const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Optional: add a unique compound index to ensure one request per user/project
joinRequestSchema.index({ user: 1, project: 1 }, { unique: true });

module.exports = mongoose.model("ProjectJoinRequest", joinRequestSchema);
