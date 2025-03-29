import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
  cloud_name: 'dj4341chw',
  api_key: '594371754745957',
  api_secret: 'YnfvirCT5U7h07bg4r-i5hQwRAU', // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: any) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
      {
        public_id: 'shoes',
      }
    )
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
