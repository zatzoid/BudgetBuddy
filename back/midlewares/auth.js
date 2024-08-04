import jsonwebtoken from 'jsonwebtoken';
const { verify } = jsonwebtoken
import { getJWT } from '../utils/getJwt.js';
import { LoginError } from '../utils/errorsType.js';


// добавление id юзера к запросу
export function Auth(req, res, next) {
  const authorization = req.cookies.Bearer;
  if (!authorization) {
    return next(new LoginError('требуется авторизация1'));
  }
  const token = authorization.replace('Bearer=', '');
  let payload;
  try {
    const key = getJWT();
    payload = verify(token, key);
  } catch (err) {
    return next(new LoginError('требуется авторизация2'));
  }
  req.user = payload;
  return next();
}