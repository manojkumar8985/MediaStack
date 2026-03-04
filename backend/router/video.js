const express = require("express");
const { uploadVideo, getMyVideos, getVideoCount } = require("../Controller/VideoController");
const { upload, protect } = require("../middleware/protect");


const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("video"),
  uploadVideo
);

router.get("/public", require("../Controller/VideoController").getPublicVideos);

// routes/videoRoutes.js
router.get("/count", protect, getVideoCount);


router.get("/myvideos", protect, getMyVideos);
router.delete("/:id", protect, require("../Controller/VideoController").deleteVideo);

module.exports = router;

