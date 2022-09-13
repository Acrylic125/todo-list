/**
 * Extracts the data from the response by following the modified JSON API response standard.
 * @param {Response} response
 * @returns
 */
export async function extractOneDataResponse(response) {
  const { data } = await response.json();
  if (data === null || data === undefined) {
    throw new Error("No data returned");
  }

  const extractedData = data.data;
  if (extractedData === null || extractedData === undefined) {
    throw new Error("Extracted data is not valid");
  }

  return extractedData;
}

/**
 * Extracts the data from the response by following the modified JSON API response standard.
 * @param {Response} response
 * @returns
 */
export async function extractManyDataResponse(response) {
  const { data } = await response.json();
  if (data === null || data === undefined) {
    throw new Error("No data returned");
  }

  if (!(data instanceof Array)) {
    throw new Error("Extracted data is not an array");
  }

  return data;
}
