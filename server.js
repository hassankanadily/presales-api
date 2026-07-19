const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT;

const opportunityRoutes = require("./routes/opportunitiesRoutes");
const requirementFiles = require("./routes/requirementFilesRoutes");
const requirementsRoutes = require("./routes/requirementsRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

app.use(express.json());

app.listen(PORT, () => {
  console.log("connected to server");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/opportunities", opportunityRoutes);
app.use("/requirement", requirementsRoutes);
app.use("/file", requirementFiles);
app.use("/opportunities", analysisRoutes);
