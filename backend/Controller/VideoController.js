const fs = require("fs");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../firebase");
const Video = require("../Models/Video");
const Text = require("../Models/Text");

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

    // ☁️ Upload to Firebase Storage
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = `uploads/${Date.now()}-${req.file.originalname}`;
    const storageRef = ref(storage, fileName);

    const metadata = {
      contentType: req.file.mimetype,
    };

    await uploadBytes(storageRef, fileBuffer, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    // Clean up local file
    fs.unlinkSync(req.file.path);

    io.emit("upload-progress", { percent: 100 });

    // 🗂 Save video (VALID ENUM VALUES ONLY)
    const video = await Video.create({
      user: req.user.id,
      title,
      videoUrl: downloadURL,
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
    const videos = await Video.find({}).sort({
      createdAt: -1,
    });

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPublicVideos = async (req, res) => {
  try {
    const videos = await Video.find({ status: { $ne: "processing" } }).sort({
      createdAt: -1,
    });
    
    const texts = await Text.find().sort({ createdAt: -1 });

    // Combine and mark types
    const combined = [
      ...videos.map(v => ({ 
        ...v.toObject(), 
        type: v.videoUrl.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i) ? 'image' : 'video' 
      })),
      ...texts.map(t => ({ ...t.toObject(), type: 'text' }))
    ];

    // Re-sort combined list by createdAt
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(combined);
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

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // ANYONE CAN DELETE NOW
    // if (video.user.toString() !== req.user.id.toString()) {
    //   return res.status(403).json({ message: "Unauthorized to delete this asset" });
    // }

    await video.deleteOne();
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};