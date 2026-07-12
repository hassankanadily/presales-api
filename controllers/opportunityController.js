const Opportunity = require("../models/Opportunities");
const OpportunityRequirement = require("../models/OpportunityRequirements");
const RequirementFile = require("../models/RequirementFile");

const createOpportunity = async (req, res) => {
  try {
    const { title, clientName, description } = req.body;

    const newOpportunity = await Opportunity.create({
      title,
      clientName,
      description,
    });

    return res.status(201).json(newOpportunity);
  } catch (error) {
    let validationErrors = {};
    for (const field in error.errors) {
      validationErrors[field] = error.errors[field].message;
    }

    return res.status(400).json(validationErrors);
  }
};

const getOpportunities = async (req, res) => {
  try {
    const { status, search } = req.query;

    const searchFilter = {};

    if (status) {
      searchFilter.status = status;
    }

    if (search) {
      searchFilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
      ];
    }

    const opportunities = await Opportunity.find(searchFilter);

    res.status(200).json(opportunities);
  } catch (error) {
    return res.status(500).json("Server error");
  }
};

const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json("No opportunity found with that id");
    }

    res.status(200).json(opportunity);
  } catch (error) {
    return res.status(400).json("Invalid opportunity id");
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json("Opportunity not found");
    }

    const requirement = await OpportunityRequirement.findOne({
      opportunityId: id,
    });
    const file = await RequirementFile.findOne({ opportunityId: id });
    if (status === "ready-for-analysis") {
      if (!requirement && !file) {
        return res
          .status(400)
          .json(
            "Opportunity cannot be marked as ready for analysis before adding requirements text or uploading files",
          );
      }
    }

    const newOpportunity = await Opportunity.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json(newOpportunity);
  } catch (error) {
    return res.status(400).json("Invalid opportunity id");
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findByIdAndDelete(id);

    if (!opportunity) {
      return res.status(404).json("Opportunity not found");
    }

    await OpportunityRequirement.findOneAndDelete({ opportunityId: id });

    await RequirementFile.deleteMany({ opportunityId: id });

    res.status(200).json("Opportunity successfully deleted");
  } catch (error) {
    return res.status(400).json("Invalid opportunity id");
  }
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
};
