const Opportunity = require("../models/Opportunities");
const OpportunityRequirement = require("../models/OpportunityRequirements");
const RequirementFile = require("../models/RequirementFile");
const OpportunityAnalysis = require("../models/OpportunityAnalysis");
const analyzeRequirements = require("../services/aiService");
const extractFileText = require("../services/extractFileText");

const createAnalysis = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json("Opportunity not found");
    }

    const requirement = await OpportunityRequirement.findOne({
      opportunityId,
    });

    const files = await RequirementFile.find({ opportunityId });

    if (!requirement && files.length === 0) {
      return res
        .status(400)
        .json(
          "No requirement text or uploaded files found for this opportunity",
        );
    }

    const filesArray = [];

    for (const file of files) {
      try {
        const extractedText = await extractFileText(file);

        filesArray.push({
          fileName: file.originalName,
          fileType: file.fileType,
          fileSize: file.fileSize,
          content: extractedText,
          processed: true,
        });
      } catch (error) {
        filesArray.push({
          fileName: file.originalName,
          fileType: file.fileType,
          fileSize: file.fileSize,
          content: "",
          processed: false,
          processingError: "This file could not be processed",
        });
      }
    }

    const aiInput = {
      requirementText: requirement?.requirementText || "",
      files: filesArray,
    };

    const aiAnalysis = await analyzeRequirements(aiInput);

    const savedAnalysis = await OpportunityAnalysis.create({
      opportunityId,
      ...aiAnalysis,
    });

    return res.status(201).json(savedAnalysis);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json("Invalid opportunity id");
    }

    return res.status(500).json(error.message);
  }
};

const getAnalysis = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json("Opportunity not found");
    }

    const latestAnalysis = await OpportunityAnalysis.findOne({
      opportunityId,
    }).sort({ analyzedAt: -1 });

    if (!latestAnalysis) {
      return res.status(404).json("No analysis exists for this opportunity");
    }

    return res.status(200).json(latestAnalysis);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json("Invalid opportunity id");
    }

    return res.status(500).json(error.message);
  }
};

module.exports = {
  createAnalysis,
  getAnalysis,
};
