const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    chapter: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    yearWiseQuestionCount: {
      type: Map,
      of: Number,
      required: true,
    },
    questionSolved: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Pending"],
      required: true,
    },
    isWeakChapter: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chapter", chapterSchema);
