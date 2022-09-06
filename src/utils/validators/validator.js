const {
  createUserSchema,
  createLangSchema,
  createLessonSchema,
  createCourseSchema,
} = require("./validatorSchema");

/**
 * @typedef {Object} User
 * @property {string} firstname - firstname of a user
 * @property {string} lastname - lastname of a user
 * @property {string} username - username to login into
 * @property {string} password - password of the username
 * @property {string} profile_pic - picture of the username on his/her profile
 */

/**
 * @function userValidator
 * @param {User} user
 * @param {boolean} [required=true]
 * @returns {Promise<any>}
 * @throws {ValidationError}
 * @see https://joi.dev/api/#validationerror
 */
async function userValidator(user, required = true) {
  const userSchema = await createUserSchema(required);
  return await userSchema.validateAsync(user);
}

/**
 * @typedef {Object} Language
 * @property {string} name - name of the language which's to be a 2-letter word as in 'EN', 'RU'
 * @property {string} code
 */

/**
 * @function languageValidator
 * @param {Language} lang
 * @param {boolean} [required=true]
 * @returns {Promise<any>}
 * @throws {ValidationError}
 * @see https://joi.dev/api/#validationerror
 */
async function languageValidator(lang, required) {
  const langSchema = await createLangSchema(required);
  return await langSchema.validateAsync(lang);
}

/**
 * @typedef {Object} Lesson
 * @property {string} name
 * @property {string} lesson_text
 * @property {number} language_id - it references to language relation
 */

/**
 * @func lessonValidator
 * @param {Lesson} lesson
 * @param {boolean} [required=true]
 * @returns {Promise<any>}
 * @throws {ValidationError}
 * @see https://joi.dev/api/#validationerror
 */

async function lessonValidator(lesson, required) {
  const lessonSchema = await createLessonSchema(required);
  return await lessonSchema.validateAsync(lesson);
}

/**
 * @typedef {Object} Course
 * @property {string} name
 * @property {Array<number>} [lessons]
 * @property {number} active_lesson
 * @property {number} owner - it references to language relation
 */

/**
 * @func courseValidator
 * @param {Course} course
 * @param {boolean} [required=true]
 * @returns {Promise<any>}
 * @throws {ValidationError}
 * @see https://joi.dev/api/#validationerror
 */

async function courseValidator(course, required) {
  const courseSchema = await createCourseSchema(required);
  return await courseSchema.validateAsync(course);
}

module.exports = {
  userValidator,
  languageValidator,
  lessonValidator,
  courseValidator,
};
