const OpportunityRequirement = require("../models/OpportunityRequirements");
const Opportunity = require("../models/Opportunities");

const addRequirement = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json("Opportunity not found");
    }
    const opportunityRecord = await OpportunityRequirement.findOne({
      opportunityId,
    });
    if (!req.body.requirementText || req.body.requirementText.trim() === "") {
      return res.status(400).json("Requirement text is required");
    }
    if (!opportunityRecord) {
      const newRecord = await OpportunityRequirement.create({
        opportunityId,
        requirementText: req.body.requirementText,
      });

      return res.status(201).json(newRecord.requirementText);
    }
    const newRecord = await OpportunityRequirement.findOneAndUpdate(
      { opportunityId },
      { requirementText: req.body.requirementText },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    res.status(200).json(newRecord.requirementText);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json("Invalid opportunity id");
    }

    if (error.name === "ValidationError") {
      return res.status(400).json(error.message);
    }
  }
};

const getRequirement = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json("Opportunity not found");
    }

    const record = await OpportunityRequirement.findOne({ opportunityId });

    if (!record) {
      return res.status(404).json("This opportunity has no requirement");
    }

    res.status(200).json(record.requirementText);
  } catch (error) {
    return res.status(400).json("Invalid opportunity id");
  }
};

const deleteRequirement = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json("Opportunity not found");
    }

    const record = await OpportunityRequirement.findOneAndDelete({
      opportunityId,
    });

    if (!record) {
      return res.status(404).json("This opportunity has no requirement");
    }

    res.status(200).json("Requirement successfully deleted");
  } catch (error) {
    return res.status(400).json("Invalid opportunity id");
  }
};

module.exports = { addRequirement, getRequirement, deleteRequirement };
