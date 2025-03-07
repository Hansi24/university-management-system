import multer from 'multer';
import path from 'path';
import fs from 'fs';


const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine and destination for storing the image files
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, 'uploads/');  // Store images in the 'uploads' folder
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, `${Date.now()}-${file.originalname}`);  // Rename file to avoid name conflicts
    },
});

// Filter to allow only specific file types
const fileFilter = (req: any, file: any, cb: any) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
};

// Configure multer
const upload = multer({ storage, fileFilter });

export default upload;
