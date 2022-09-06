const Joi = require("joi");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

/**
 * @function createUserSchema
 * @param {boolean} [required=true]
 * @return {Promise<import("joi").ObjectSchema>}
 */
function createUserSchema(required = true) {
  let userSchema;
  return new Promise((resolve, reject) => {
    if (required) {
      userSchema = Joi.object({
        firstname: Joi.string().alphanum().trim().min(5).max(250).required(),
        lastname: Joi.string().alphanum().trim().min(5).max(250).required(),
        username: Joi.string().alphanum().trim().min(8).max(250).required(),
        password: Joi.string().trim().pattern(passwordRegex).required(),
        profile_pic: Joi.string(),
      });
    } else {
      userSchema = Joi.object({
        firstname: Joi.string().alphanum().trim().min(5).max(250),
        lastname: Joi.string().alphanum().trim().min(5).max(250),
        username: Joi.string().alphanum().trim().min(8).max(250),
        password: Joi.string().trim().pattern(passwordRegex),
        profile_pic: Joi.string(),
      });
    }
    resolve(userSchema);
  });
}
/**
 * @function createLangSchema
 * @param {boolean} [required = true]
 * @returns {Promise<import("joi").ObjectSchema>}
 */
async function createLangSchema(required = true) {
  let langSchema;
  return new Promise((resolve, reject) => {
    if (required) {
      langSchema = Joi.object({
        name: Joi.string().min(3).max(50).trim().required(),
        code: Joi.string().length(2).trim().required(),
      });
    } else {
      langSchema = Joi.object({
        name: Joi.string().min(3).max(50).trim(),
        code: Joi.string().length(2).trim(),
      });
    }

    resolve(langSchema);
  });
}
/**
 * @function createLessonSchema
 * @param {boolean} [required = true]
 * @returns {Promise<import("joi").ObjectSchema>}
 */
async function createLessonSchema(required = true) {
  let courseSchema;
  return new Promise((resolve, reject) => {
    if (required) {
      courseSchema = Joi.object({
        name: Joi.string().min(3).max(255).trim().required(),
        lesson_text: Joi.string().trim().required(),
        language_id: Joi.number().greater(0).required(),
      });
    } else {
      courseSchema = Joi.object({
        name: Joi.string().min(3).max(255).trim(),
        lesson_text: Joi.string().trim(),
        language_id: Joi.number().greater(0),
      });
    }

    resolve(courseSchema);
  });
}
/**
 * @function createCourseSchema
 * @param {boolean} [required = true]
 * @returns {Promise<import("joi").ObjectSchema>}
 */
async function createCourseSchema(required = true) {
  let courseSchema;
  return new Promise((resolve, reject) => {
    if (required) {
      courseSchema = Joi.object({
        name: Joi.string().min(3).max(255).trim().required(),
        lessons: Joi.array().items(Joi.number().greater(0)).required(),
        active_lesson: Joi.number().greater(0).required(),
        owner: Joi.number().greater(0).required(),
      });
    } else {
      courseSchema = Joi.object({
        name: Joi.string().min(3).max(255).trim(),
        active_lesson: Joi.number().greater(0),
        lessons: Joi.array().items(Joi.number().greater(0)),
        owner: Joi.number().greater(0),
      });
    }

    resolve(courseSchema);
  });
}

module.exports = {
  createUserSchema,
  createLangSchema,
  createLessonSchema,
  createCourseSchema,
};
