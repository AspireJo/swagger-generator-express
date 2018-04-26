'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** skip the first {offset} records
 * @type {integer}
 */
var offset = exports.offset = {
  in: 'query',
  optional: true,
  isInt: {
    errorMessage: 'Invalid offset value, should be number more than or equals to 0',
    options: { min: 0 }
  }
};
/** getting {limit} records after the skipped {offset}
 * @type {integer}
 */
var limit = exports.limit = {
  in: 'query',
  optional: true,
  isInt: {
    errorMessage: 'Invalid limit value, should be more than 0 and less than or equals to 100',
    options: { min: 1, max: 100 }
  }
};