const { courseValidator } = require("../../utils/validators/validator");
const { isUserAvailableAsyncQuery } = require("../users/user.query");
const {
  isCourseAvailableAsyncQuery,
  addCourseQuery,
  getAllCoursesQuery,
  getUserCoursesQuery,
  deleteCourseByIdQuery,
  updateCoursebyIdQuery,
} = require("./course.query");

/**
 * @function getAllCourses
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function getAllCourses(req, res, next) {
  try {
    const { rows } = await getAllCoursesQuery();
    res.status(200).json({ courses: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * @function getUserCourses
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function getUserCourses(req, res, next) {
  const { userId } = req.params;
  try {
    const { rows } = await getUserCoursesQuery(undefined, userId);
    res.status(200).json({ userCourse: rows });
  } catch (error) {
    next(error);
  }
}
/**
 * @function deleteCourseById
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function deleteCourseById(req, res, next) {
  const { courseId } = req.params;
  try {
    await isCourseAvailableAsyncQuery(undefined, courseId, "id", "delete");
    await deleteCourseByIdQuery(undefined, courseId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

/**
 * @function updateCoursebyId
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function updateCoursebyId(req, res, next) {
  const { courseId } = req.params;
  const newCourse = req.body;
  try {
    await courseValidator(newCourse, false);
    await isUserAvailableAsyncQuery(undefined, newCourse.owner, "id", "select");
    const oldCourse = await isCourseAvailableAsyncQuery(
      undefined,
      courseId,
      "id",
      "select"
    );
    await updateCoursebyIdQuery(oldCourse, undefined, courseId, newCourse);
    res.sendStatus(204);
  } catch (error) {
    req.statusCode = 400;
    next(error);
  }
}
/**
 * @function addCourse
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function addCourse(req, res, next) {
  /**
   * @type {import("../../utils/validators/validator").Course}
   */
  const newCourse = req.body;
  try {
    // await isCourseAvailableAsyncQuery(
    //   undefined,
    //   newCourse.name,
    //   "name",
    //   "insert"
    // );

    await courseValidator(newCourse, undefined);
    await isUserAvailableAsyncQuery(undefined, newCourse.owner, "id", "select");
    const { rows } = await addCourseQuery(undefined, newCourse);
    res.status(201).json({ newCourse: rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCourses,
  addCourse,
  getUserCourses,
  deleteCourseById,
  updateCoursebyId,
};
