import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });

cloudinary.config({
  cloud_name: "dmehekkkf",
  api_key: "475919295639981",
  api_secret: process.env.CLOUTDINARY_API_SECRET, // keep your original env key
});

export const uploadFileToCouldinary = async (filePath) => {
  if (!filePath) return null;

  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("file uploaded to cloudinary:", response.url);

    // Delete file after successful upload
    fs.unlinkSync(filePath);

    return response.url; // return the URL so the controller can use it
  } catch (error) {
    console.log(error);

    // Safely delete the file only if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null;
  }
};
