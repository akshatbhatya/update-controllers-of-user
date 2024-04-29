import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

async function uploadLocalFile(localFile) {
  try {
   const data= await cloudinary.uploader.upload(localFile, { resource_type: "auto" });
    fs.unlinkSync(localFile);
    return data;
  } catch (error) {
    fs.unlinkSync(localFile);
  }
}

export default uploadLocalFile;
