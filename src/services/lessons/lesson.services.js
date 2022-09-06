const { lessonValidator } = require("../../utils/validators/validator");
const { isLangAvailableAsyncQuery } = require("../languages/language.query");
const {
  getAllLessonsQuery,
  isLessonAvailableAsyncQuery,
  addLessonQuery,
  updateLessonByIdQuery,
  deleteLessonByIdQuery,
} = require("./lesson.query");

/**
 * @function getAllLessons
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function getAllLessons(req, res, next) {
  try {
    const { rows } = await getAllLessonsQuery(undefined);
    const allLessons = rows;
    res.status(200).json({ lessons: allLessons });
  } catch (error) {
    next(error);
  }
}

/**
 * @function addLesson
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function addLesson(req, res, next) {
  /**
   * @type {import("../../utils/validators/validator").Lesson}
   */
  const newLesson = req.body;
  try {
    await lessonValidator(newLesson, true);
    await isLangAvailableAsyncQuery(
      undefined,
      newLesson.language_id,
      "id",
      "select"
    );
    await isLessonAvailableAsyncQuery(
      undefined,
      newLesson.name,
      "name",
      "insert"
    );
    const { rows } = await addLessonQuery(undefined, newLesson);
    res.status(201).json({ lesson: rows[0] });
  } catch (error) {
    req.statusCode = 400;
    next(error);
  }
}
/**
 * @function updateLessonById
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function updateLessonById(req, res, next) {
  const { lessonId } = req.params;
  const newLesson = req.body;
  try {
    await lessonValidator(newLesson, false);
    const oldLesson = await isLessonAvailableAsyncQuery(
      undefined,
      lessonId,
      "id",
      "update"
    );
    const { rows } = await updateLessonByIdQuery(
      oldLesson,
      undefined,
      lessonId,
      newLesson
    );
    const updatedLesson = rows[0];
    res.status(200).json({ lesson: updatedLesson });
  } catch (error) {
    req.statusCode = 400;
    next(error);
  }
}
/**
 * @function deleteLessonById
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function deleteLessonById(req, res, next) {
  const { lessonId } = req.params;
  try {
    await isLessonAvailableAsyncQuery(undefined, lessonId, "id", "delete");
    await deleteLessonByIdQuery(undefined, lessonId, "id");
    res.sendStatus(204);
  } catch (error) {
    req.statusCode = 400;
    next(error);
  }
}

module.exports = {
  getAllLessons,
  addLesson,
  updateLessonById,
  deleteLessonById,
};
