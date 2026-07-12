# Pre-Sales API

## Project Description

This API was developed to allow users to create and manage business opportunities. They are allowed to have exactly one requirement text record for each opportunity, and can upload multiple requirement files with a maximum file size of 5 MB.

## Technologies used

- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemon
- Postman
- dotenv
- multer

## Setup Instructions

1. Download the project folder
2. Open the project folder in Visual Studio Code
3. Open the terminal in Visual Studio Code
4. Run `npm install` to install the required dependencies
5. Create a new `.env` file using `.env.example` as a template
6. Replace `your_mongodb_connection_string` with your own MongoDB connection string.

## How to run the project

After completing the setup instructions, run the following command in the terminal: `npm run dev`.

The server will start on the port specified in the `.env` file.

## Important Notes

- New opportunities are created with the default status `new`, so there is no need to provide a status when creating one

- The allowed opportunity statuses are `new`, `in-progress`, `ready-for-analysis`, and `closed`

- An opportunity cannot be marked as `ready-for-analysis` unless it has requirements text or at least one uploaded file

- Each opportunity can have only one requirements text record, but it can have multiple requirement files

- Only PDF, DOCX, and TXT files are accepted

- Each uploaded file must not exceed 5 MB

- Uploaded files are stored locally inside the `filesUploaded` folder
