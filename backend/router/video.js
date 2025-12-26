const express = require("express");
const { uploadVideo,getMyVideos ,getVideoCount} = require("../Controller/VideoController");
const { upload, protect } = require("../middleware/protect");


const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("video"),
  uploadVideo
);
// routes/videoRoutes.js
router.get("/count",  protect, getVideoCount);


router.get("/myvideos", protect, getMyVideos);

module.exports = router;

