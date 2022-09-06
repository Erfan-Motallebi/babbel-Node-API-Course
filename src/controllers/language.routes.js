const express = require("express");
const {
  getAllLanguages,
  addLanguage,
  updateLangById,
  updatesLangById,
  deleteLangById,
  deleteLangs,
} = require("../services/languages/language.services");
const router = express.Router();

router.get("/list", getAllLanguages);
router.post("/add", addLanguage);
router
  .route("/update/:langId(\\d+)")
  .patch(updateLangById)
  .put(updatesLangById);
router.delete("/delete/:langId", deleteLangById);
router.delete("/delete", deleteLangs);

module.exports = {
  languageRoutes: router,
};
