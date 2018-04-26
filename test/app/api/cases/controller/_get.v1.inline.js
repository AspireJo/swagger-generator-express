/**
 * Get inline response
 * @returns {object} {prop1:string:this is first property,prop2:boolean:this is sec property}
 * @property {string} tags - Tests
 * @property {string} route - /inline
 */
export async function controller(req, res) { return res.send('get inline model'); }
export const route = '/inline';
