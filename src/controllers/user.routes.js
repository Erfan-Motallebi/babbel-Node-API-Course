const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadImage: { multerFilter, multerStorage },
} = require("../utils/helpers");
const {
  userUpdate,
  addUser,
  userRemove,
  userInfo,
} = require("../services/users/user.services");

const uploadImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Create user Account
router.post("/signup", uploadImage.single("profile_pic"), addUser);
router.get("/info/:userId(\\d+)", userInfo);
router.patch(
  "/update/:userId(\\d+)",
  uploadImage.single("profile_pic"),
  userUpdate
);
router.delete("/delete/:userId", userRemove);

module.exports = {
  userRoutes: router,
};
