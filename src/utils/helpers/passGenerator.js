const Bcrypt = require("bcrypt");

/**
 * @function passToHash
 * @param {string} password
 * @param {number} saltRounds
 * @returns {Promise<string>}
 */
async function passToHash(saltRounds = 10, password) {
  const salt = await Bcrypt.genSalt(saltRounds);
  const hashedPass = await Bcrypt.hash(password, salt);
  return hashedPass;
}

/**
 *
 * @param {string} simplePass
 * @param {string} hashedPass
 * @returns {Promise<boolean>}
 */

async function hashCompare(simplePass, hashedPass) {
  const isMatched = await Bcrypt.compare(simplePass, hashedPass);
  return isMatched;
}

module.exports = {
  passToHash,
  hashCompare,
};
