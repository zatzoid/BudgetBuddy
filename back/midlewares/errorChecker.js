import { BAD_REQUEST_ERROR, DEFAULT_ERROR } from '../utils/errorsCodes.js';

export function errorCheker(err, req, res, next) {
  console.log(err.name, err.statusCode, err.message);
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(BAD_REQUEST_ERROR).send({ message: err.message, statusCode: BAD_REQUEST_ERROR });


  } else if (['NotFoundError', 'LoginError', 'RegistrError', 'NoRightError'].includes(err.name)) {
    return res.status(err.statusCode).send({ message: err.message, statusCode: err.statusCode });


  }else if (['MongoServerSelectionError'].includes(err.name)){
    return res.status(500).send({ message: 'Ошибка в работе бд', statusCode: 500 });

    
  }else{
    return res.status(DEFAULT_ERROR).send({ message: err.message });
  }
 
}