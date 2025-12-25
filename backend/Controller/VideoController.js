const cloudinary = require("../cloudnary");
const Video = require("../Models/Video");

exports.uploadVideo = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });

    const video = await Video.create({
      user: req.user.id,
      title,
      videoUrl: result.secure_url,
      status: "processing",
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
