const express = require("express");
const { createText, getAllTexts, deleteText } = require("../Controller/TextController");

const router = express.Router();

router.post("/", createText);
router.get("/", getAllTexts);
router.delete("/:id", deleteText);

module.exports = router;
