const {
  multerFilter,
  multerStorage,
  unlinkAsync,
  replaceImage,
} = require("./upload");
const { passToHash, hashCompare } = require("./passGenerator");

module.exports = {
  uploadImage: {
    multerFilter,
    multerStorage,
    unlinkAsync,
    replaceImage,
  },
  hashGenerator: {
    passToHash,
    hashCompare,
  },
};
