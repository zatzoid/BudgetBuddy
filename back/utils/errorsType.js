class LoginError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LoginError';
    this.statusCode = 401;
  }
}
class NoRightError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoRightError';
    this.statusCode = 403;
  }
}
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}
class RegistrError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RegistrError';
    this.statusCode = 409;
  }
}
class RequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RequestError';
    this.statusCode = 400;
  }
}
export {
  LoginError,
  NoRightError,
  NotFoundError,
  RegistrError,
  RequestError,
};