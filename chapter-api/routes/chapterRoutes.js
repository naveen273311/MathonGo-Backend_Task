const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const Chapter = require("../models/chapterModel");
const adminAuth = require("../middlewares/adminAuth");

const {
  getAllChapters,
  getChapterById, 
} = require("../controllers/chapterController");

//  GET all chapters with filters, pagination, caching
router.get("/", getAllChapters);

//  GET single chapter by ID
router.get("/:id", getChapterById); 

//  POST - Upload JSON of chapters (admin only)
router.post("/", adminAuth, upload.single("file"), async (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "JSON file is required" });

  try {
    const data = fs.readFileSync(req.file.path, "utf8");
    const chaptersArray = JSON.parse(data);

    if (!Array.isArray(chaptersArray)) {
      return res
        .status(400)
        .json({ error: "JSON must be an array of chapters" });
    }

    let failed = [];
    let success = [];

    for (const chapterData of chaptersArray) {
      try {
        const chapter = new Chapter(chapterData);
        await chapter.save();
        success.push(chapter);
      } catch (err) {
        failed.push({ chapter: chapterData, error: err.message });
      }
    }

    fs.unlinkSync(req.file.path); // cleanup uploaded file

    res.status(207).json({
      message: "Upload processed",
      successCount: success.length,
      failed,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to process file", details: err.message });
  }
});

module.exports = router;
