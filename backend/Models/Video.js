const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["processing", "safe", "flagged"],
    default: "processing",
  },
}, { timestamps: true });

module.exports = mongoose.model("Video", videoSchema);
