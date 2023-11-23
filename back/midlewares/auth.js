const jwt = require('jsonwebtoken');
const { getJWT } = require('../utils/getJwt');
const { LoginError } = require('../utils/errorsType');

// добавление id юзера к запросу
module.exports.Auth = (req, res, next) => {
  const authorization = req.cookies.Bearer;
  if (!authorization) {
    return next(new LoginError('требуется авторизация1'));
  }
  const token = authorization.replace('Bearer=', '');
  let payload;
  try {
    const key = getJWT();
    payload = jwt.verify(token, key);
  } catch (err) {
    return next(new LoginError('требуется авторизация2'));
  }
  req.user = payload;
  return next();
};