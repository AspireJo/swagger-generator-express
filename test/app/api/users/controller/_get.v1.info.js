/**
 * Get user info
 * @returns {user}
 * @property {string} tags - Users
 * @property {string} route - /users/{id}
 */
export async function controller(req, res) { return res.send('get user info'); }
export const route = '/users/:id';
