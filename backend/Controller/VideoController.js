const cloudinary = require("../cloudnary");
const Video = require("../Models/Video");

exports.uploadVideo = async (req, res) => {
  const io = req.app.get("io");

  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    // 🔄 Fake upload progress (UI only)
    io.emit("upload-progress", { percent: 10 });

    setTimeout(() => {
      io.emit("upload-progress", { percent: 40 });
    }, 400);

    setTimeout(() => {
      io.emit("upload-progress", { percent: 70 });
    }, 800);

    // ☁️ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });

    io.emit("upload-progress", { percent: 100 });

    // 🗂 Save video (VALID ENUM VALUES ONLY)
    const video = await Video.create({
      user: req.user.id,
      title,
      videoUrl: result.secure_url,
      status: "processing", // ✅ valid
    });

    // ✅ Mark as SAFE (VALID ENUM)
    video.status = "safe";
    await video.save();

    res.status(201).json(video);
  } catch (error) {
    io.emit("upload-progress", { percent: -1 });
    res.status(500).json({ message: error.message });
  }
};

exports.getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getVideoCount = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    const count = await Video.countDocuments({ uploadedBy: userId });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch video count" });
  }
};