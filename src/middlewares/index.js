const { errorHandler } = require("./errorHandler.middleware");
const { notFound } = require("./notFound.middleware");

module.exports = {
  errorHandler,
  notFound,
};
