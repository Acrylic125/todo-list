import BaseError from "../BaseError";

export default class InvalidMethodError extends BaseError {
  constructor(method) {
    super(`${method} is not a valid method for this route`);
    this.status = "405";
    this.title = "Invalid Method";
    Error.captureStackTrace(this, this.constructor);
  }
}
