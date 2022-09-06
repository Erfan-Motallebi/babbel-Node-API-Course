const express = require("express");
const {
  getAllLessons,
  addLesson,
  updateLessonById,
  deleteLessonById,
} = require("../services/lessons/lesson.services");

const router = express.Router();

router.get("/list", getAllLessons);
router.post("/add", addLesson);
router.patch("/update/:lessonId(\\d+)", updateLessonById);
router.delete("/delete/:lessonId(\\d+)", deleteLessonById);

module.exports = {
  lessonRoutes: router,
};
