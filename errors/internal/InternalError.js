import BaseError from "../BaseError";

/**
 * InternalError occurs when a server error occurs.
 * Example:
 * - When the database is down.
 * - When an error is not handled.
 *
 * This error should be used as a fallback. However, errors
 * should be descriptive in where it happens if it is safe to do so
 * (i.e. when the error is not sensitive).
 */
export default class InternalError extends BaseError {
  constructor(message = "An internal error has occurred.") {
    super(message);
    this.status = "500";
    this.title = "Internal Error";
    Error.captureStackTrace(this, this.constructor);
  }
}
