import { strJoined } from "../../utils/string-utils";
import BaseError from "../BaseError";

export default class ParamError extends BaseError {
  /**
   *
   * @param {string | string[]} parameters
   */
  constructor(parameters = []) {
    super(`Invalid ${strJoined(parameters)} supplied`);
    this.status = "400";
    this.title = "Param Error";
    Error.captureStackTrace(this, this.constructor);
  }
}
