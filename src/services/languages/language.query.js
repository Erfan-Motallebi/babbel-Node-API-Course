const _ = require("lodash");

/**
 * @function isLangAvailableAsyncQuery - search through the language relation by means of name or id
 * @param {string} [schema='public']
 * @param {string} condition
 * @param {string} field
 * @param {string} queryMethod
 * @returns {Promise<import("../../utils/validators/validator").Language>}
 */
async function isLangAvailableAsyncQuery(
  schema = "public",
  condition,
  field,
  queryMethod
) {
  return new Promise(async (resolve, reject) => {
    const processedCond = field === "name" ? condition : parseInt(condition);
    const query = {
      text: `SELECT name, code FROM ${schema}.languages WHERE ${field} = $1 LIMIT 1`,
      values: [processedCond],
    };
    const { rows } = await pgPool.query(query);
    const lang = rows[0];

    if (lang && queryMethod === "insert") {
      reject(new Error("Language is already set."));
    }
    if (!lang && ["update", "select", "delete"].includes(queryMethod)) {
      reject(new Error("Language not found"));
    }

    resolve(lang);
  });
}

/**
 * @function getAllLangQuery
 * @param {string} [schema='public']
 * @returns {Promise<import("pg").QueryArrayResult>}
 */
async function getAllLangQuery(schema = "public") {
  const query = {
    text: `SELECT id, name, code FROM ${schema}.languages`,
    // values: []
  };

  /**
   * @type {import("pg").QueryArrayResult}
   */
  const queryRes = await pgPool.query(query);

  return queryRes;
}

/**
 * @function addLanguageQuery
 * @param {string} [schema='public']
 * @param {import("../../utils/validators/validator").Language} fields
 * @returns {Promise<import("pg").QueryArrayResult>}
 */
async function addLanguageQuery(schema = "public", fields) {
  const { name, code } = fields;
  const query = {
    text: `INSERT INTO ${schema}.languages(name, code) VALUES ($1, $2) RETURNING name, code`,
    values: [name, code],
  };

  const queryRes = await pgPool.query(query);
  return queryRes;
}

/**
 * @summary this function works for both Required | Noo-Required fields of updating a language
 * @function updateLangByIdQuery
 * @param {Partial<import("../../utils/validators/validator").Language>} oldLang
 * @param {string} [schema='public']
 * @param {number} condition
 * @param {Partial<import("../../utils/validators/validator").Language>}
 * @returns {Promise<import("pg").QueryArrayResult>}
 */
async function updateLangByIdQuery(
  oldLang,
  schema = "public",
  condition,
  fields
) {
  const lang = oldLang;

  // Swapping the Object key-value pair whether they're required or optional
  for (const [key, value] of Object.entries(fields)) {
    if (_.has(oldLang, key)) {
      lang[key] = value;
    }
  }

  const { name, code } = lang;

  const query = {
    text: `UPDATE ${schema}.languages SET name = $1, code = $2 WHERE id = $3 RETURNING name, code`,
    values: [name, code, +condition],
  };

  const queryRes = await pgPool.query(query);

  return queryRes;
}

/**
 * @function removeLangByIdQuery
 * @param {string} [schema='public']
 * @param {number} condition
 * @param {string} field
 * @returns {Promise<number>}
 */
async function removeLangByIdQuery(schema = "public", condition, field) {
  const query = {
    text: `DELETE FROM ${schema}.languages WHERE ${field} = $1`,
    values: [+condition],
  };

  const queryRes = await pgPool.query(query);

  return queryRes;
}
/**
 * @function removeLangsByQuery
 * @param {string} [schema='public']
 * @returns {Promise<number>}
 */
async function removeLangsByQuery(schema = "public") {
  const query = {
    text: `DELETE FROM ${schema}.languages`,
    // values: [],
  };

  const queryRes = await pgPool.query(query);

  return queryRes;
}

module.exports = {
  getAllLangQuery,
  isLangAvailableAsyncQuery,
  addLanguageQuery,
  updateLangByIdQuery,
  removeLangByIdQuery,
  removeLangsByQuery,
};
