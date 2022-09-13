import BaseError from "../BaseError";

/**
 * DuplicateError occurs when there is a request fails
 * due to a duplicate entry in the database.
 */
export default class DuplicateError extends BaseError {
  constructor(resource = "Resource") {
    super(`${resource} already exists.`);
    this.status = "409";
    this.title = "Duplicate Error";
    Error.captureStackTrace(this, this.constructor);
  }
}
