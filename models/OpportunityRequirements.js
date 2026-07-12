const mongoose = require("mongoose");

const OpportunityRequirementsSchema = new mongoose.Schema({
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Opportunity",
    unique: true,
  },
  requirementText: {
    type: String,
    required: true,
    minlength: [10, "Requirement text must be at least 10 characters"],
  },
});

const OpportunityRequirement = mongoose.model(
  "OpportunityRequirement",
  OpportunityRequirementsSchema,
);

module.exports = OpportunityRequirement;
