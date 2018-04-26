/**
 * Get users list
 * @returns {user[]}
 * @property {string} schema - pagination
 * @property {string} tags - Users
 * @property {string} route - /users
 * @property {string} responseCodes - 403, 204
 */
export async function controller(req, res) { return res.send('get users list'); }
export const route = '/users';
