/**
 * Get int response
 * @returns {integer}
 * @property {string} tags - Tests
 * @property {string} route - /int
 */
export async function controller(req, res) { return res.send('get int'); }
export const route = '/int';
