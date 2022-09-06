// Upload Configuration
const multer = require("multer");
const path = require("node:path");
const { unlink } = require("node:fs");
const { promisify } = require("util");

const unlinkAsync = promisify(unlink);

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("public/images/users/"));
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const uploadedFile = `public/images/users`;
    req.uploadedImagesDir = uploadedFile;

    cb(null, `user-${file.originalname}-${Date.now()}.${ext}`);
  },
});

/**
 * @function multerFilter
 * @param {import("express").Request} req
 * @param {Express.Multer.File} file
 * @param {multer.FileFilterCallback} cb
 */

const multerFilter = (req, file, cb) => {
  const ext = file.mimetype.split("/")[1];
  if (ext === "jpeg" || ext === "png" || ext === "jpg") {
    cb(null, true);
  } else {
    cb(
      new Error("File extension is not valid. please try jpeg,png or jpg"),
      false
    );
  }
};

/**
 * @function replaceImage
 * @param {string} newPicPath
 * @param {string} oldPicPath
 */
async function replaceImage(newPicPath, oldPicPath) {
  // delete old file
  await unlinkAsync(oldPicPath);

  // add new file
}

module.exports = {
  multerFilter,
  multerStorage,
  replaceImage,
  unlinkAsync,
};
