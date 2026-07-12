const multer = require("multer");
const path = require("path");

const fileUpload = multer({
  dest: "filesUploaded/",
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase().slice(1);

    const allowedExtensions = ["pdf", "docx", "txt"];

    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error("File type is not allowed"));
    }
  },
});

const uploadFileMiddleware = (req, res, next) => {
  fileUpload.single("file")(req, res, (error) => {
    if (error?.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json("File size must not exceed 5 MB");
    }

    if (error) {
      return res.status(400).json(error.message);
    }

    next();
  });
};

module.exports = uploadFileMiddleware;
