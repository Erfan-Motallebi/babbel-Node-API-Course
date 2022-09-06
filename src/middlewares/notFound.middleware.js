/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function notFound(req, res, next) {
  req.statusCode = 404;
  req.statusMessage = `Page Not Found`;
  next();
}

module.exports = {
  notFound,
};
