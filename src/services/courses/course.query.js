const _ = require("lodash");

/**
 * @function isCourseAvailableAsyncQuery - search through the language relation by means of name or id
 * @param {string} [schema='public']
 * @param {string} condition
 * @param {string} field
 * @param {string} queryMethod
 * @returns {Promise<import("../../utils/validators/validator").Language>}
 */
async function isCourseAvailableAsyncQuery(
  schema = "public",
  condition,
  field,
  queryMethod
) {
  return new Promise(async (resolve, reject) => {
    const processedCond = field === "name" ? condition : parseInt(condition);

    const query = {
      text: `
      SELECT id, name, active_lesson, owner, course_id, string_to_array(string_agg(lesson_id::TEXT, ', '), ', ') AS lesson_ids
      FROM ${schema}.courses, ${schema}.course_lesson
      WHERE ${field} = $1
      GROUP BY
          1,2,3,4,5
      LIMIT 1
      `,
      values: [processedCond],
    };
    const { rows } = await pgPool.query(query);
    const course = rows[0];

    if (course && queryMethod === "insert") {
      reject(new Error("Course is already set."));
    }
    if (!course && ["update", "select", "delete"].includes(queryMethod)) {
      reject(new Error("Course not found"));
    }

    resolve(course);
  });
}

/**
 * @function getAllCoursesQuery
 * @param {string} [schema='public']
 * @returns {Promise<import("pg").QueryArrayResult>}
 */
async function getAllCoursesQuery() {
  const query = {
    text: `
        SELECT id, name, active_lesson, owner, course_id, string_to_array(string_agg(lesson_id::TEXT, ', '), ', ') AS lesson_ids
          FROM courses, course_lesson
          GROUP BY 
                1,2,3,4,5
    `,
    // values: []
  };

  const queryRes = await pgPool.query(query);
  return queryRes;
}
/**
 * @function updateCoursebyIdQuery
 * @param {Required<import("../../utils/validators/validator").Course>} oldCourse
 * @param {string} [schema='public']
 * @param {string} condition
 * @param {import("../../utils/validators/validator").Course} fields
 * @returns {Promise<import("pg").QueryArrayResult>}
 */
async function updateCoursebyIdQuery(
  oldCourse,
  schema = "public",
  condition,
  fields
) {
  const course = oldCourse;

  // Swapping the Object key-value pair whether they're required or optional
  for (const [key, value] of Object.entries(fields)) {
    if (_.has(oldCourse, key)) {
      course[key] = value;
    }
  }

  const { owner, active_lesson, name } = course;

  const query = {
    text: `
        UPDATE ${schema}.courses SET name = $1, owner = $2, active_lesson = $3
        WHERE id = $4
    `,
    values: [name, owner, active_lesson, +condition],
  };

  const queryRes = await pgPool.query(query);
  return queryRes;
}

/**
 * @function addCourseQuery
 * @param {string} [schema='public']
 * @param {import("../../utils/validators/validator").Course} fields
 * @returns {Promise<import("pg").QueryArrayResult>}
 */
async function addCourseQuery(schema = "public", fields) {
  const { active_lesson, name, owner, lessons } = fields;

  const lessons_input = lessons.map((undefined, index) => {
    return `$${index + 4}`;
  });
  // c stands for course
  // c_l stands for course_lesson [bridge table]

  const queryStatment = `
          WITH c AS (
            INSERT INTO ${schema}.courses(name, active_lesson, owner)
                  VALUES($1,$2,$3) RETURNING name, active_lesson, owner, id as cid
          ), c_l AS (
            INSERT INTO ${schema}.course_lesson(course_id, lesson_id)
                      ( 
                        SELECT cid, l.id FROM c, lessons AS l
                        WHERE l.id IN (${lessons_input.join(",").split()})
                      )
            RETURNING course_id, lesson_id
          )
          SELECT name, active_lesson, owner, course_id, string_to_array(string_agg(lesson_id::TEXT, ', '), ', ') AS lesson_ids
          FROM c, c_l
          GROUP BY 
                1,2,3,4
         `;

  const courseQuery = {
    text: queryStatment,
    values: [name, active_lesson, owner, ...lessons],
  };
  const queryRes = await pgPool.query(courseQuery);

  return queryRes;
}
/**
 * @function getUserCoursesQuery
 * @param {string} condition
 * @param {string} [schema='public']
 * @returns {Promise<import("pg").QueryArrayResult>}
 */
async function getUserCoursesQuery(schema = "public", condition) {
  const query = {
    text: `
          SELECT name, active_lesson, owner, course_id, string_to_array(string_agg(lesson_id::TEXT, ', '), ', ') AS lesson_ids
          FROM ${schema}.courses c
          INNER JOIN ${schema}.course_lesson c_l ON c.id = c_l.course_id
          WHERE c.owner = $1
          GROUP BY
              1,2,3,4
    `,
    values: [+condition],
  };

  const queryRes = await pgPool.query(query);

  return queryRes;
}

/**
 * @function deleteCourseByIdQuery
 * @param {string} [schema='public']
 * @param {string} condition
 * @returns {Promise<number>}
 */
async function deleteCourseByIdQuery(schema = "public", condition) {
  const query = {
    text: `DELETE FROM ${schema}.courses WHERE id = $1`,
    values: [+condition],
  };

  const queryRes = await pgPool.query(query);
  return queryRes;
}

module.exports = {
  isCourseAvailableAsyncQuery,
  addCourseQuery,
  getAllCoursesQuery,
  getUserCoursesQuery,
  deleteCourseByIdQuery,
  updateCoursebyIdQuery,
};
