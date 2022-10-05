import moment from "moment";
import momentDurationSetup from "moment-duration-format";

momentDurationSetup(moment);

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

export function formatDuration(duration) {
  return moment.duration(duration).format("y[y] M[m] d[d] h[h] m[min] s[s]");
}

export function formatDate(date) {
  return moment(date).format("MMM DD, YYYY");
}

export function formatDateTime(dateTime) {
  return moment(dateTime).format("MMM DD, YYYY, [at] hh:mm:ss");
}
