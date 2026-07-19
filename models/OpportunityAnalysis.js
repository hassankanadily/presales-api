const mongoose = require("mongoose");

const OpportunityAnalysisSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Opportunity",
    },
    summary: {
      type: String,
      required: true,
    },
    mainFeatures: {
      type: [String],
    },
    technicalNeeds: {
      type: [String],
    },
    risks: {
      type: [String],
    },
    questions: {
      type: [String],
    },
    complexity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const OpportunityAnalysis = mongoose.model(
  "OpportunityAnalysis",
  OpportunityAnalysisSchema,
);

module.exports = OpportunityAnalysis;
