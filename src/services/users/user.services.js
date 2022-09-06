const {
  createUserQuery,
  updateUserByIdQuery,
  removeUserByIdQuery,
  isUserAvailableAsyncQuery,
} = require("../users/user.query");
const { userValidator } = require("../../utils/validators/validator");
const {
  hashGenerator: { passToHash },
} = require("../../utils/helpers");

const _ = require("lodash");

/**
 * @function addUser
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function addUser(req, res, next) {
  /**
   * @type {Required<import("../../utils/validators/validator").User>}
   */
  const newUser = req.body;
  try {
    await isUserAvailableAsyncQuery(
      undefined,
      newUser.username,
      "username",
      "insert"
    );
    await userValidator(newUser, undefined);
    const file = req.file;

    // File availability check
    if (!file) {
      throw new Error("File was not uploaded");
    }
    newUser.profile_pic = file.filename;

    // Password Generator and assigning to the password field

    const { password } = newUser;
    const hashedPass = await passToHash(undefined, password);
    newUser.password = hashedPass;

    const { rows } = await createUserQuery(undefined, newUser);

    res.status(201).json({ user: _.omit(rows[0], ["password"]) });
  } catch (error) {
    next(error);
  }
}

/**
 * @function userInfo
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function userInfo(req, res, next) {
  const { userId } = req.params;

  try {
    const availableUser = await isUserAvailableAsyncQuery(
      undefined,
      userId,
      "id",
      "select"
    );
    user = _.omit(availableUser, ["password"]);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * @function userUpdate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function userUpdate(req, res, next) {
  /**
   * @type {Omit<Partial<import("../../utils/validators/validator").User>, 'created_at'>}
   */
  const userFields = req.body;
  const { userId } = req.params;
  try {
    await userValidator(userFields, false);
    const { rows } = await updateUserByIdQuery(
      req,
      undefined,
      userFields,
      userId
    );
    const user = rows[0];
    res.status(200).json({ updatedUser: user });
  } catch (error) {
    next(error);
  }
}

/**
 * @function userRemove
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

async function userRemove(req, res, next) {
  const { userId } = req.params;

  try {
    await isUserAvailableAsyncQuery(undefined, userId, "id");

    await removeUserByIdQuery(undefined, userId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

/**
 * @function userPicReplace
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

module.exports = {
  addUser,
  userInfo,
  userRemove,
  userUpdate,
};
