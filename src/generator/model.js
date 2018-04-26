import _ from 'lodash';
import readers from './../reader';
import parsers from './../parser';
import Exceptions from './../exceptions';

// known types [primitive]
const KNOWN_TYPES = ['string', 'integer', 'boolean', 'float', 'number'];

// generate inline model documentation
const getInlineModelDescription = async (modelDescription) => {
  if (!modelDescription) return undefined;
  let properties = {};
  const rawObjectDescription = modelDescription.slice(1, -1);
  rawObjectDescription
    .split(',')
    .filter(a => !_.isEmpty(a))
    .forEach((rawInlinePropertyDef) => {
      const propDescription = rawInlinePropertyDef.split(':').filter(a => !_.isEmpty(a));
      const [propName, propType, propDesc] = propDescription;
      const prop = {};
      prop[propName] = { type: propType, description: propDesc };
      properties = _.merge({}, properties, prop);
    });
  return properties;
};

const getBaseModelDescription = async (modelPath, modelsMap) => {
  const res = await readers.jsDoc(modelPath);
  const modelClassDescription = res.filter(item => item.kind === 'class' && item.scope === 'global' && item.augments)['0'];
  // eslint-disable-next-line no-use-before-define
  if (modelClassDescription && modelClassDescription.augments) return recGetDescription(modelClassDescription.augments['0'], modelsMap, undefined);
  return undefined;
};

const getPropertyDescription = async (property, modelsMap) => {
  if (!property || property.undocumented) return undefined;
  const prop = await parsers.model.getPropertyType(property);
  let description;
  if (KNOWN_TYPES.find(a => a === prop.model)) description = { type: prop.model, description: prop.description };
  else {
    // eslint-disable-next-line no-use-before-define
    const des = await recGetDescription(prop.model, modelsMap, undefined);
    description = { description: prop.description, properties: des };
  }
  if (property.properties) {
    await _.forOwn(property.properties, async (value) => {
      const pp = await parsers.model.getPropertyType(value);
      if (pp.type === 'array') description[value.name] = value.description.split(',');
      else description[value.name] = value.description;
    });
  }
  return prop.type === 'array' ? { type: 'array', items: description } : description;
};

// recursive get description
const recGetDescription = async (modelName, modelsMap, modelDescription) => {
  if (!modelName) return undefined; // unkown model
  if (KNOWN_TYPES.find(a => a === modelName)) return { type: modelName }; // known type
  if (modelName === 'object') return getInlineModelDescription(modelDescription); // inline model
  logger(`generate model ${modelName} docuemntation`);
  // check cache
  const cached = cache.get('model', modelName);
  if (cached) return cached;
  // get model path from map
  const modelPath = modelsMap[modelName];
  if (!modelPath) throw Exceptions.unkonwn(modelName, 'model'); // unknown
  // read jsDoc
  const res = await readers.jsDoc(modelPath);
  // filter documentations
  const membersInfo = _.uniqBy(res.filter(item => item.kind === 'member' && (item.scope === 'instance' || (item.scope === 'global' && !item.undocumented))), 'name');
  if (!membersInfo) throw Exceptions.undocumented(modelPath, 'missing documentation for model');// missing
  // get properties documentation
  const propsRes = await Promise.map(membersInfo, async (element) => {
    const propDescription = await getPropertyDescription(element, modelsMap, modelPath);
    if (!propDescription) return { status: 'invalid', name: element.name };
    const x = {};
    x[element.name] = propDescription;
    return x;
  }, { concurrency: concurrencyLimit });
  // filter uncommented properties
  const invalidProps = propsRes.filter(a => a.status === 'invalid');
  if (invalidProps.length > 0) throw Exceptions.undocumented(modelPath, `missing documentation for proeprties : ${invalidProps.join(', ')}`);
  // get parent model documentation
  const parentModelDesc = await getBaseModelDescription(modelPath, modelsMap);
  // construct documentation
  const modelDocumentation = _.merge({}, _.merge(...propsRes), parentModelDesc);
  // add to cache
  cache.set('model', modelName, modelDocumentation);
  return modelDocumentation;
};

export default {
  getDescription: async (modelName, modelsMap, modelDescription) => recGetDescription(modelName, modelsMap, modelDescription)
};
