const { ValidationError } = require("joi");
const { MulterError } = require("multer");

/**
 *
 * @param {} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function errorHandler(err, req, res, next) {
  let status = req.statusCode || 500;
  let message = req.statusMessage || err.message;
  fields = [];

  // Check user input type through Joi Module
  if (err instanceof ValidationError) {
    status = 400;
    message = "Input Error";
    fields = err.details.map((detail) => detail.message);
  }

  if (err instanceof MulterError) {
    message = err.message;
    fields = err.field;
  }

  res.status(status).json({ status, message, fields: fields });
}

module.exports = {
  errorHandler,
};
