/**
 *
 * @param {string[]} arr
 * @param {string} s1
 * @param {string} s2
 * @returns
 */
export function lstrJoin(arr, s1, s2) {
  return arr
    .slice(0, -1)
    .join(s1)
    .concat(arr.length > 1 ? s2 : "", ...arr.slice(-1));
}

/**
 *
 * @param {string | string[]} str
 * @returns
 */
export function strJoined(str) {
  return `${str instanceof Array ? lstrJoin(str, ", ", " and/or ") : str}`;
}
