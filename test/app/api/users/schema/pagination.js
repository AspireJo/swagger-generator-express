/** skip the first {offset} records
 * @type {integer}
 */
export const offset = {
  in: 'query',
  optional: true,
  isInt: {
    errorMessage: 'Invalid offset value, should be number more than or equals to 0',
    options: { min: 0 },
  },
};
/** getting {limit} records after the skipped {offset}
 * @type {integer}
 */
export const limit = {
  in: 'query',
  optional: true,
  isInt: {
    errorMessage: 'Invalid limit value, should be more than 0 and less than or equals to 100',
    options: { min: 1, max: 100 },
  },
};
