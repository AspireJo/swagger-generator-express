import _ from 'lodash';
import helpers from './../helpers';
import api from './api';

export default async (config) => {
  // list models, schemas and controllers
  const [models, schemas, controllers] = await Promise.all([
    helpers.glob.asMap(config.patterns.models),
    helpers.glob.asMap(config.patterns.schemas),
    helpers.glob.list(config.patterns.controllers)]);
  // log number of globbed files
  logger(`found : ${_.keysIn(models).length} models, ${_.keysIn(schemas).length} schema, ${controllers.length} controller`);
  // generate documentation
  const results = await Promise.map(controllers, async controller => api(controller, models, schemas, config), { concurrency: concurrencyLimit });
  // construct return object
  return { documentation: _.merge({}, ...results.filter(a => !a.file)), undocumented: results.filter(a => a.file) };
};
