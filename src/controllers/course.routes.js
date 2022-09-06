const express = require("express");
const {
  getAllCourses,
  addCourse,
  getUserCourses,
  deleteCourseById,
  updateCoursebyId,
} = require("../services/courses/course.services");

const router = express.Router();

router.get("/list", getAllCourses);
router.get("/:userId(\\d+)", getUserCourses);
router.post("/add", addCourse);
router.patch("/update/:courseId(\\d+)", updateCoursebyId);
router.delete("/delete/:courseId(\\d+)", deleteCourseById);

module.exports = {
  courseRoutes: router,
};
