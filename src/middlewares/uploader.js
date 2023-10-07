const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const eventStorage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "TE_event",
  },
});

const userStorage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "TE_user",
  },
});

const qrStorage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "TE_qr",
  },
});

const uploadEvent = multer({ storage: eventStorage });
const uploadUser = multer({ storage: userStorage });
const uploadQr = multer({ storage: qrStorage });

module.exports = {
  uploadEvent,
  uploadUser,
  uploadQr,
};
