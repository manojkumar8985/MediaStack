const Text = require("../Models/Text");

const createText = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }
    
    const newText = new Text({ content });
    await newText.save();
    
    res.status(201).json({ success: true, data: newText, message: "Text saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save text", error: error.message });
  }
};

const getAllTexts = async (req, res) => {
  try {
    const texts = await Text.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: texts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch texts", error: error.message });
  }
};

const deleteText = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedText = await Text.findByIdAndDelete(id);
    
    if (!deletedText) {
      return res.status(404).json({ success: false, message: "Text not found" });
    }
    
    res.status(200).json({ success: true, message: "Text deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete text", error: error.message });
  }
};

module.exports = {
  createText,
  getAllTexts,
  deleteText,
};
