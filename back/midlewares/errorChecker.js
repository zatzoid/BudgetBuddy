const { BAD_REQUEST_ERROR, DEFAULT_ERROR } = require('../utils/errorsCodes');

module.exports.errorCheker = (err, req, res, next) => {
  console.log(err.name, err.statusCode, err.message);
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(BAD_REQUEST_ERROR).send({ message: err.message, statusCode: BAD_REQUEST_ERROR });
  }
  if (['NotFoundError', 'LoginError', 'RegistrError', 'NoRightError'].includes(err.name)) {
    return res.status(err.statusCode).send({ message: err.message, statusCode: err.statusCode });
  }
  return res.status(DEFAULT_ERROR).send({ message: err.message });
};