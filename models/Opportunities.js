const mongoose = require("mongoose");

const OpportunitiesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [3, "Title must be at least 3 characters"],
  },
  clientName: {
    type: String,
    required: [true, "Client Name is required"],
    minlength: [2, "Client Name must be at least 2 characters"],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: "new",
    enum: ["new", "in-progress", "ready-for-analysis", "closed"],
  },
});

const Opportunity = mongoose.model("Opportunity", OpportunitiesSchema);

module.exports = Opportunity;
