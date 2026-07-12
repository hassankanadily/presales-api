const RequirementFile = require("../models/RequirementFile");
const Opportunity = require("../models/Opportunities");
const fs = require("fs/promises");
const path = require("path");

const uploadFile = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    if (!req.file) {
      return res.status(400).json("No file uploaded");
    }

    const { originalname, filename, path: filePath, size } = req.file;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      await fs.unlink(filePath);
      return res.status(404).json("Opportunity not found");
    }

    const fileType = path.extname(originalname).toLowerCase().slice(1);

    const uploaded = await RequirementFile.create({
      opportunityId,
      originalName: originalname,
      fileName: filename,
      filePath,
      fileType,
      fileSize: size,
    });

    res.status(201).json(uploaded);
  } catch (error) {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (fileError) {}
    }

    if (error.name === "CastError") {
      return res.status(400).json("Invalid opportunity id");
    }

    return res.status(500).json("Something went wrong");
  }
};

const getFiles = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json("Opportunity not found");
    }

    const files = await RequirementFile.find({ opportunityId });

    res.status(200).json(files);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json("Invalid opportunity id");
    }

    return res.status(500).json("Something went wrong");
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await RequirementFile.findById(fileId);

    if (!file) {
      return res.status(404).json("File not found");
    }

    try {
      await fs.unlink(file.filePath);
    } catch (fileError) {
      if (fileError.code !== "ENOENT") {
        return res.status(500).json("Could not delete the physical file");
      }
    }

    await RequirementFile.findByIdAndDelete(fileId);

    res.status(200).json("File deleted successfully");
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json("Invalid file id");
    }

    return res.status(500).json("Something went wrong");
  }
};

module.exports = { uploadFile, getFiles, deleteFile };
