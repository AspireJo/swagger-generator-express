import _ from 'lodash';
import schemaGenerator from './schema';
import Exceptions from './../exceptions';
import parsers from './../parser';

// returns properties list
const getProperties = async (rawDoc) => {
  if (!rawDoc.properties) return undefined;
  const props = await Promise.map(rawDoc.properties, async (property) => {
    const typeDesc = await parsers.description.getTypeDescription(property);
    return [[property.name, await parsers.value(typeDesc, property.description)]];
  }, { concurrency: concurrencyLimit });
  return _.fromPairs(_.concat(...props));
};
// returns property description
const getPropertyDescription = async rawDoc => ({
  description: rawDoc.description,
  type: rawDoc.type ? rawDoc.type.names[0] : undefined,
});
// returns the response body
const constructBodyRequest = async (schemaPropsRes) => {
  logger('generate body request');
  let bodyDescription;
  const isArrayBody = schemaPropsRes.filter(a => a.isBodyProp && a.name.indexOf('*') > -1).length > 0;
  const inBodyProps = schemaPropsRes.filter(a => a.isBodyProp).map(a => [a.name.replace('*.', ''), _.omit(a, ['isBodyProp', 'name'])]);
  if (!_.isEmpty(inBodyProps)) {
    const itemsWithNestedObjects = inBodyProps.filter(a => a[0].indexOf('.') > -1);
    if (!_.isEmpty(itemsWithNestedObjects)) {
      const tempBodyDesc = [];
      inBodyProps.forEach((prop) => {
        if (prop[0].indexOf('.') === -1) tempBodyDesc.push(prop);
        else {
          const key = prop[0].split('.')[0].trim();
          const subKey = prop[0].split('.')[1].trim();
          const x = tempBodyDesc.findIndex(a => a[0] === key);
          if (x === -1) tempBodyDesc.push([key, []]);
          const indx = tempBodyDesc.findIndex(a => a[0] === key);
          tempBodyDesc[indx][1] = _.concat([], tempBodyDesc[indx][1], [[subKey, prop[1]]]);
        }
      });
      bodyDescription = _.fromPairs(tempBodyDesc.map(x => (Array.isArray(x[1]) ? [x[0], { type: 'object', properties: _.fromPairs(x[1]) }] : x)));
    } else bodyDescription = _.fromPairs(inBodyProps);
    return _.merge(
      {},
      {
        name: 'requestBody',
        in: 'body',
        required: true,
        description: 'JSON object representing request body',
      },
      isArrayBody ?
        {
          schema: {
            type: 'array',
            items: {
              properties: bodyDescription,
            }
          }
        } :
        {
          schema: {
            type: 'object',
            properties: bodyDescription,
          }
        }
    );
  }
  return undefined;
};
export default {
  // returns version parameters
  getVersionParameters: async (version, config) => (config.versions ? config.versions[version] || [] : []),

  // returns url parameters
  getUrlParameters: async (route, config) => {
    if (!config.params) return []; // no params defined
    const urlPars = [];
    _.forEach(_.split(route, '/').filter(a => a.startsWith('{')).map(key => key.slice(1, -1)), (segmant) => {
      urlPars.push(config.params[segmant] || undefined);
    });
    return urlPars.filter(a => a);
  },

  // returns schema parameters
  getSchemaParameters: async (schemaFiles, schemasMap) => {
    if (!schemaFiles || !schemaFiles.length) return undefined; // no schema
    logger('generate schema parameters documentation');
    // map schemas
    const mapRes = await Promise.map(schemaFiles, async (file) => {
      const schemaLocation = schemasMap[file];
      if (!schemaLocation) throw Exceptions.unkonwn(file, 'schema');
      return schemaGenerator.getSchemaDescription(schemaLocation);
    }, { concurrency: concurrencyLimit });

    // no caching as the controller can combine any schemas together
    const schemaPropsRes = await Promise.map(mapRes, async (schemaInfo) => {
      const { docs, file } = schemaInfo;
      if (_.isEmpty(docs)) throw Exceptions.undocumented(file, 'documentation missing for schema');
      // if schema has default & locale specific definition use the default as it should contain all props
      const schemaDef = _.isFunction(schemaInfo.schema) ? schemaInfo.schema({ body: {}, query: {}, params: {} }) : schemaInfo.schema.default || schemaInfo.schema;
      return Promise.map(_.toPairs(schemaDef), async (input) => {
        const [shcemaPropKey, schemaPropValue] = input;
        const propDoc = _.mapKeys(_.pickBy(docs, value => value.name.trim().replace(/"/g, '') === shcemaPropKey), () => 'val').val;
        if (!propDoc) return { status: 'invalid', shcemaPropKey };
        let parameterDetails = {};
        if (schemaPropValue.in === 'body') parameterDetails = { isBodyProp: true, name: shcemaPropKey };
        else {
          parameterDetails = {
            required: !schemaPropValue.optional,
            name: shcemaPropKey,
            in: _.replace(schemaPropValue.in || 'query', 'params', 'path'),
          };
        }
        return _.merge({}, await getProperties(propDoc), await getPropertyDescription(propDoc), parameterDetails);
      }, { concurrency: concurrencyLimit });
    }, { concurrency: concurrencyLimit });

    const aggregatedSchema = _.concat(...schemaPropsRes);
    const missingProps = aggregatedSchema.filter(a => a.status).map(a => a.shcemaPropKey);
    if (!_.isEmpty(missingProps)) throw Exceptions.undocumented('schema file', `documentation missing for properties: ${missingProps.join(', ')}`);
    const schemaPars = aggregatedSchema.filter(a => !a.isBodyProp);
    return _.concat(schemaPars, await constructBodyRequest(aggregatedSchema));
  }
};
