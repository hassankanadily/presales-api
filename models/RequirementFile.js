const mongoose = require("mongoose");

const RequirementFileSchema = new mongoose.Schema({
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Opportunity",
  },
  originalName: {
    type: String,
  },
  fileName: {
    type: String,
  },
  filePath: {
    type: String,
  },
  fileType: {
    type: String,
    enum: ["pdf", "docx", "txt"],
  },
  fileSize: {
    type: Number,
    max: 5 * 1024 * 1024,
  },
});

const RequirementFile = mongoose.model(
  "RequirementFile",
  RequirementFileSchema,
);

module.exports = RequirementFile;
