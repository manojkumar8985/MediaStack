const express = require("express");
const { uploadVideo } = require("../Controller/VideoController");
const { upload, protect } = require("../middleware/protect");


const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("video"),
  uploadVideo
);

module.exports = router;
