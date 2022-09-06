const _ = require("lodash");

/**
 * @function isLessonAvailableAsyncQuery - search through the language relation by means of name or id
 * @param {string} [schema='public']
 * @param {string} condition
 * @param {string} queryMethod
 * @returns {Promise<import("../../utils/validators/validator").Language>}
 */
async function isLessonAvailableAsyncQuery(
  schema = "public",
  condition,
  field,
  queryMethod
) {
  return new Promise(async (resolve, reject) => {
    const processedCond = field === "name" ? condition : parseInt(condition);

    const query = {
      text: `SELECT name, lesson_text, language_id FROM ${schema}.lessons WHERE ${field} = $1`,
      values: [processedCond],
    };

    const { rows } = await pgPool.query(query);
    const lesson = rows[0];

    if (lesson && queryMethod === "insert") {
      reject(new Error("Lesson is already set."));
    }
    if (!lesson && ["update", "select", "delete"].includes(queryMethod)) {
      reject(new Error("Lesson not found"));
    }

    resolve(lesson);
  });
}

/**
 * @function getAllLessonsQuery
 * @param {string} [schema='public']
 * @returns {Promise<import("pg").QueryArrayResult>}
 */
async function getAllLessonsQuery(schema = "public") {
  const query = {
    text: `SELECT id, name,lesson_text, language_id FROM ${schema}.lessons`,
    // values: []
  };

  const queryRes = await pgPool.query(query);

  return queryRes;
}
/**
 * @function addLessonQuery
 * @param {string} [schema='public']
 * @param {import("../../utils/validators/validator").Lesson} fields
 * @returns {Promise<import("pg").QueryArrayResult>}
 */

async function addLessonQuery(schema = "public", fields) {
  const { language_id, lesson_text, name } = fields;

  const query = {
    text: `INSERT INTO ${schema}.lessons(name, lesson_text, language_id) VALUES ($1, $2, $3) RETURNING *`,
    values: [name, lesson_text, language_id],
  };

  const queryRes = await pgPool.query(query);
  return queryRes;
}

/**
 * @summary this function works for both Required | Noo-Required fields of updating a language
 * @function updateLessonByIdQuery
 * @param {Partial<import("../../utils/validators/validator").Lesson>} oldlesson
 * @param {string} [schema='public']
 * @param {number} condition
 * @param {Partial<import("../../utils/validators/validator").Lesson>} fields
 * @returns {Promise<import("pg").QueryArrayResult>}
 */
async function updateLessonByIdQuery(
  oldlesson,
  schema = "public",
  condition,
  fields
) {
  const lesson = oldlesson;

  // Swapping the Object key-value pair whether they're required or optional
  for (const [key, value] of Object.entries(fields)) {
    if (_.has(oldlesson, key)) {
      lesson[key] = value;
    }
  }

  const { name, language_id, lesson_text } = lesson;

  const query = {
    text: `UPDATE ${schema}.lessons SET name = $1, lesson_text = $2, language_id = $3 WHERE id = $4 RETURNING name, lesson_text, language_id`,
    values: [name, lesson_text, language_id, +condition],
  };

  const queryRes = await pgPool.query(query);

  return queryRes;
}

/**
 * @function deleteLessonByIdQuery
 * @param {string} [schema='public']
 * @param {number} condition
 * @param {string} field
 * @returns {Promise<number>}
 */
async function deleteLessonByIdQuery(schema = "public", condition, field) {
  const query = {
    text: `DELETE FROM ${schema}.languages WHERE ${field} = $1`,
    values: [+condition],
  };

  const queryRes = await pgPool.query(query);

  return queryRes;
}

module.exports = {
  getAllLessonsQuery,
  isLessonAvailableAsyncQuery,
  addLessonQuery,
  updateLessonByIdQuery,
  deleteLessonByIdQuery,
};
