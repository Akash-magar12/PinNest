// Import DatauriParser to convert buffer (file in memory) into a Data URI string
import DatauriParser from "datauri/parser.js";
// Import path to help get the file extension (e.g., .jpg, .png)
import path from "path";

// This function converts an in-memory file (from multer memoryStorage) into a Data URI
const getDataUri = (file) => {
  // Create a new parser instance
  const parser = new DatauriParser();

  // Get the file extension (like .jpg, .png) from the original uploaded file
  const extName = path.extname(file.originalname);

  // Convert the file buffer to a Data URI format (base64 string with MIME type)
  return parser.format(extName, file.buffer); // returns an object with `.content`
};

// Export this function so it can be used in controllers or routes
export default getDataUri;
