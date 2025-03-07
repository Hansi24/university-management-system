import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "profile_pics", // Save images in this Cloudinary folder
    format: file.mimetype.split("/")[1], // Extract format from file mimetype
    allowed_formats: ["jpg", "jpeg", "png"], // Restrict file types
  }),
});

const upload = multer({ storage });

export default upload;
