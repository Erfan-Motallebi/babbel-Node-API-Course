const _ = require("lodash");
const {
  hashGenerator: { hashCompare, passToHash },
  uploadImage: { unlinkAsync },
} = require("../../utils/helpers");

const path = require("node:path");

/**
 * @function createUser
 * @param {string} [schema='public']
 * @param {import("../../utils/validators/validator").User} fields
 * @returns {Promise<any>}
 */

/**
 * @function isUserAvailabileAsync - search through the user relation by means of username or id
 * @param {string} [schema='public']
 * @param {number|string} condition
 * @param {string} field
 * @param {string} queryMethod
 * @returns {Promise<import("../../utils/validators/validator").User>}
 */
async function isUserAvailableAsyncQuery(
  schema = "public",
  condition,
  field,
  queryMethod
) {
  return new Promise(async (resolve, reject) => {
    const processedCond =
      field === "username" ? condition : parseInt(condition);
    const query = {
      text: `SELECT id, firstname, lastname, username, password, profile_pic, created_at FROM ${schema}.users WHERE ${field} = $1 LIMIT 1`,
      values: [processedCond],
    };

    /**
     * @type {import("pg").QueryArrayResult}
     */
    const { rows } = await pgPool.query(query);
    const user = rows[0];

    if (user && queryMethod === "insert") {
      reject(new Error("User is already set."));
    }
    if (!user && ["update", "select", "delete"].includes(queryMethod)) {
      reject(new Error("User not found"));
    }

    resolve(user);
  });
}

async function createUserQuery(schema = "public", fields) {
  const values = Object.values(fields);

  /**
   * @type {import("pg").QueryArrayResult}
   */
  const query = {
    text: `INSERT INTO ${schema}.users(firstname, lastname, username, password, profile_pic) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    values: [...values],
  };

  const queryRes = await pgPool.query(query);
  return queryRes;
}

/**
 * @function updateUserById
 * @param {import("express").Request} req
 * @param {string} [schema='public']
 * @param {number} condition
 * @param {Omit<import("../../utils/validators/validator").User, 'created_at' | 'profile_pic'>} fields
 * @returns {Promise<import("pg").QueryArrayResult>>}
 */

async function updateUserByIdQuery(req, schema = "public", fields, condition) {
  /**
   * @type {import("../../utils/validators/validator").User}
   */
  const user = await isUserAvailableAsyncQuery(
    undefined,
    condition,
    "id",
    "update"
  );

  /**
   * @type {Omit<import("../../utils/validators/validator").User, 'created_at'>}
   */
  const updatedUser = {};

  // User Profile Image Check
  let newImage = "";
  let oldImage = user.profile_pic;
  updatedUser.profile_pic = oldImage;

  if (req.file) {
    newImage = req.file.filename;
    const uploadedFilePath = req.uploadedImagesDir;
    await unlinkAsync(`${uploadedFilePath}/${oldImage}`);
    updatedUser.profilePic = newImage;
  }

  // Password Check
  const isPassMatched = await hashCompare(fields.password, user.password);

  if (!isPassMatched) {
    fields.password = await passToHash(undefined, fields.password);
  }

  for (const [key, value] of Object.entries(fields)) {
    if (_.has(user, key)) {
      updatedUser[key] = value;
    }
  }

  const { firstname, lastname, password, username, profile_pic } = updatedUser;

  const query = {
    text: `UPDATE ${schema}.users SET firstname = $1 , lastname = $2, username = $3, password = $4, profile_pic = $5 WHERE id= $6 RETURNING firstname, lastname, username`,
    values: [
      firstname,
      lastname,
      username,
      password,
      profile_pic,
      parseFloat(condition),
    ],
  };

  /**
   * @type {import("pg").QueryArrayResult}
   */
  const queryRes = await pgPool.query(query);

  return queryRes;
}

/**
 * @function removeUserByIdQuery
 * @param {import("express").Request} req
 * @param {string} [schema='public']
 * @param {number} condition
 * @returns {Promise<number>}
 */

async function removeUserByIdQuery(schema = "public", condition) {
  const query = {
    text: `DELETE FROM ${schema}.users WHERE id = $1 RETURNING profile_pic`,
    values: [parseInt(condition)],
  };

  /**
   * @type {import("pg").QueryArrayResult}
   */
  const queryRes = await pgPool.query(query);

  /**
   * @type {import("../../utils/validators/validator").User}
   */
  const user = queryRes.rows[0];

  // user profile remove
  const profilePic = user.profile_pic;
  const profilePicPath = "public/images/users";
  await unlinkAsync(path.resolve(`${profilePicPath}/${profilePic}`));
  return queryRes;
}

module.exports = {
  createUserQuery,
  updateUserByIdQuery,
  removeUserByIdQuery,
  isUserAvailableAsyncQuery,
};
