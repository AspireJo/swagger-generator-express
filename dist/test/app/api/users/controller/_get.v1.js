'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.controller = controller;
/**
 * Get users list
 * @returns {user[]}
 * @property {string} schema - pagination
 * @property {string} tags - Users
 * @property {string} route - /
 * @property {string} responseCodes - 403, 204
 */
async function controller(req, res) {
  return res.send('get users list');
}
var route = exports.route = '/';