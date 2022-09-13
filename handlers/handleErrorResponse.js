import BaseError from "../errors/BaseError";

/**
 *
 * @param {import("next").NextApiResponse} res
 * @param {unknown} error
 */
function respondError(res, error) {
  // custom errors
  if (error instanceof BaseError) {
    const { status } = error;
    const parsedStatus = status === undefined ? 500 : parseInt(status, 10);
    const response = {
      errors: [error.toJSON()],
    };
    res.status(parsedStatus).send(response);
    return;
  }

  /**
   * In the event we are dealing with an array of errors.
   * According to JSON.API https://jsonapi.org/format/#errors-processing,
   *
   * 9.1 Processing Errors
   * A server MAY choose to stop processing as soon as a problem is encountered, or it MAY continue processing and encounter multiple problems. For instance, a server might process multiple attributes and then return multiple validation problems in a single response.
   *
   * This will prove useful for when we are sending multiple of the same type of SQL query.
   */
  if (error instanceof Array) {
    const errors = error
      .map((e) => {
        if (e instanceof BaseError) {
          return e.toJSON();
        }
        return e;
      })
      .filter((e) => e !== undefined);
    const response = {
      errors,
    };
    /**
     * Although it is said that 400 should be returned for 4xx codes,
     * there are cases whereby we MAY return a mix of 4xx and 5xx codes.
     *
     * Since there is no guarantee that all codes are EITHER 4xx or 5xx,
     * we will return with a status of 500 as the MOST GENERAL response.
     */
    res.status(500).send(response);
    return;
  }

  const response = {
    errors: [
      {
        status: "500",
        title: "Internal Server Error",
        detail: "An unexpected error has occurred, please contact an administrator",
      },
    ],
  };
  // other errors
  res.status(500).send(response); // fallback
}

/**
 *
 * @param {import("next").NextApiHandler} func
 * @returns {import("next").NextApiHandler}
 */
export default function hanleErrorResponse(func) {
  /** @type {import("next").NextApiHandler} */
  const handler = async (req, res) => {
    try {
      await Promise.resolve(func(req, res));
    } catch (error) {
      console.error(error);
      respondError(res, error);
    }
  };
  return handler;
}
