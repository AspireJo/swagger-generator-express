import Promise from 'bluebird';
import _ from 'lodash';
import parsers from './src/parser';
import generators from './src/generator';
import defaultConfig from './config';
import helpers from './src/helpers';

global.Promise = Promise;
global.cache = helpers.cache;
global.logger = message => console.debug(`\x1b[33mswagger-generator-express::\x1b[0m ${message}`);

const writeOutput = async (data, config) => helpers.file.save(config, 'output', data);
const writeError = async (data, config) => helpers.file.save(config, 'error', data);
const internalGenerate = async (config) => {
  const startTime = new Date();
  logger(`generate documentation started at \x1b[36m${startTime.toString()}\x1b[0m ...`);
  let customConfig = config;
  // eslint-disable-next-line global-require, import/no-dynamic-require
  // load config from file
  if (typeof config === 'string') customConfig = await helpers.file.load(config);
  // prepare configs
  const mergedConfig = _.merge({}, defaultConfig, customConfig);
  // validate configs
  helpers.validation.validateConfig(mergedConfig);
  // set global settings
  global.concurrencyLimit = mergedConfig.concurrencyLimit || 0;
  // Generate documentation for both package and endpoints
  const [pkgInfo, endpointsDocs] = await Promise.all([parsers.packageInfo(), generators.endpoints(mergedConfig)]);
  // prepare output
  const generatedJson = _.merge(
    {},
    mergedConfig.specs,
    { tags: _.flatten(mergedConfig.tags) },
    {
      info: pkgInfo,
    },
    {
      paths: endpointsDocs.documentation,
    },
  );
  const unDocumented = endpointsDocs.undocumented;
  // write output files
  await Promise.all([writeOutput(generatedJson, mergedConfig.output), writeError(unDocumented, mergedConfig.output)]);
  // clear cache
  cache.clear();
  const endTime = new Date();
  logger(`\x1b[32m${_.keys(endpointsDocs.documentation).length} endpoints success\x1b[0m, \x1b[31m${endpointsDocs.undocumented.length} error found\x1b[0m`);
  logger(`generated documentation finished at \x1b[36m${endTime.toString()} \x1b[0m`);
  logger(`total execution time \x1b[36m${(endTime - startTime) / 1000} sec\x1b[0m`);
};

export const generate = async config => internalGenerate(config);

export default {
  generate: async config => internalGenerate(config),
};
