const redisClient = require("../redis/redisClient");
const Chapter = require("../models/chapterModel");

// GET /api/v1/chapters - With filters, pagination, and Redis caching
exports.getAllChapters = async (req, res) => {
  try {
    const {
      class: classFilter,
      unit,
      status,
      weakChapters,
      subject,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};
    if (classFilter) filter.class = classFilter;
    if (unit) filter.unit = unit;
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (weakChapters !== undefined)
      filter.isWeakChapter = weakChapters === "true";

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const cacheKey = `chapters:${JSON.stringify({
      filter,
      page: pageNum,
      limit: limitNum,
    })}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(" Served from Redis");
      return res.json(JSON.parse(cached));
    }

    const [chapters, total] = await Promise.all([
      Chapter.find(filter).skip(skip).limit(limitNum),
      Chapter.countDocuments(filter),
    ]);

    const response = {
      total,
      page: pageNum,
      limit: limitNum,
      chapters,
    };

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));
    console.log(" Served from MongoDB and cached");

    res.json(response);
  } catch (err) {
    console.error("Error in getAllChapters:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET /api/v1/chapters/:id - Get a single chapter by ID
exports.getChapterById = async (req, res) => {
  try {
    // Trim the id to remove extra whitespace/newlines
    const id = req.params.id.trim();

    const chapter = await Chapter.findById(id);

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    res.status(200).json(chapter);
  } catch (err) {
    console.error("Error in getChapterById:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

