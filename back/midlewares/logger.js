import { transports as _transports, format as _format } from 'winston';
import { logger, errorLogger as _errorLogger } from 'express-winston';

const requestLogger = logger({
  transports: [
    new _transports.File({ filename: 'request.log' }),
  ],
  format: _format.json(),
});

const errorLogger = _errorLogger({
  transports: [
    new _transports.File({ filename: 'error.log' }),
  ],
  format: _format.json(),
});

export {
  requestLogger,
  errorLogger,
};