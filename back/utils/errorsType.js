class LoginError extends Error {
    constructor(message) {
        super(message);
        this.name = 'LoginError';
        this.statusCode = 401;
    }
}
module.exports = LoginError;

class NoRightError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoRightError';
        this.statusCode = 403;
    }
}
module.exports = NoRightError;

class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.statusCode = 404;
    }
  }
  module.exports = NotFoundError;

  class RegistrError extends Error {
    constructor(message) {
      super(message);
      this.name = 'RegistrError';
      this.statusCode = 409;
    }
  }
  module.exports = RegistrError;

  class RequestError extends Error {
    constructor(message) {
      super(message);
      this.name = 'RequestError';
      this.statusCode = 400;
    }
  }
  module.exports = RequestError;