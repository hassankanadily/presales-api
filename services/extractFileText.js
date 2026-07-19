const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs/promises");

const extractFileText = async (file) => {
  const { fileType, filePath } = file;

  switch (fileType) {
    case "txt":
      //go to the file path and convert the bytes to text
      return await fs.readFile(filePath, "utf8");

    case "pdf": {
      // get the data in binary
      const fileBuffer = await fs.readFile(filePath);

      // creates a new pdf parser and takes the data and then reads it using getText
      const parser = new PDFParse({
        data: fileBuffer,
      });

      const result = await parser.getText();

      //destorys memorya
      await parser.destroy();

      return result.text;
    }
    case "docx": {
      // extract only the readable text
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      return result.value;
    }

    default:
      throw new Error("Unsupported file type");
  }
};

module.exports = extractFileText;
