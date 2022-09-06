const { languageValidator } = require("../../utils/validators/validator");
const {
  getAllLangQuery,
  isLangAvailableAsyncQuery,
  addLanguageQuery,
  updateLangByIdQuery,
  removeLangByIdQuery,
  removeLangsByQuery,
} = require("./language.query");

/**
 * @function getAllLanguages
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function getAllLanguages(req, res, next) {
  try {
    const { rows } = await getAllLangQuery();
    const languages = rows;
    res.status(200).json({ langs: languages });
  } catch (error) {
    next(error);
  }
}

/**
 * @function addLanguage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function addLanguage(req, res, next) {
  /**
   * @type {import("../../utils/validators/validator").Language}
   */
  const newLang = req.body;

  try {
    await languageValidator(newLang);
    await isLangAvailableAsyncQuery(undefined, newLang.name, "name", "insert");
    const { rows } = await addLanguageQuery(undefined, newLang);
    res.status(201).json({ language: rows[0] });
  } catch (error) {
    req.statusCode = 400;
    next(error);
  }
}

/**
 * @function updateLang
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function updateLangById(req, res, next) {
  const { langId } = req.params;
  const lang = req.body;
  try {
    await languageValidator(lang, false);
    const oldLang = await isLangAvailableAsyncQuery(
      undefined,
      langId,
      "id",
      "update"
    );
    const { rows } = await updateLangByIdQuery(
      oldLang,
      undefined,
      langId,
      lang
    );
    // we're not using 204 because we're returning something to show - it depends
    res.status(200).json({ updatedLang: rows[0] });
  } catch (error) {
    next(error);
  }
}

/**
 * @function updatesLang
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function updatesLangById(req, res, next) {
  const { langId } = req.params;
  const lang = req.body;
  try {
    await languageValidator(lang, undefined);
    const oldLang = await isLangAvailableAsyncQuery(
      undefined,
      langId,
      "id",
      "update"
    );
    await updateLangByIdQuery(oldLang, undefined, langId, lang);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

/**
 * @function deleteLangById
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function deleteLangById(req, res, next) {
  const { langId } = req.params;
  try {
    await isLangAvailableAsyncQuery(undefined, langId, "id", "delete");
    await removeLangByIdQuery(undefined, langId, "id");
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

/**
 * @function deleteLangs
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function deleteLangs(req, res, next) {
  try {
    await removeLangsByQuery(undefined);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllLanguages,
  addLanguage,
  updateLangById,
  updatesLangById,
  deleteLangById,
  deleteLangs,
};
