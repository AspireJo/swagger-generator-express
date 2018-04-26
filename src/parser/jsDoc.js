import _ from 'lodash';

const findAllByName = async (jsDoc, propName) => _.entries(_.pickBy(jsDoc.properties, { name: propName })).map(item => _.mapKeys(item, () => 'val').val);

export default {
  // return all items by filter
  findByFilter: async (rawDoc, predicate) => {
    const docsArray = _.toPairs(rawDoc).map(a => a[1]);
    return _.head(_.filter(docsArray, predicate));
  },

  // returns all items by name
  findTagByName: async (rawDoc, propName) => {
    const all = await findAllByName(rawDoc, propName);
    return (_.head(all) || { description: '' }).description.split(',')
      .map(item => item.trim()).filter(a => a !== '');
  },

  // return type properties
  // {type:array|object, model:model_name, description:property_description}
  getTypeDescription: async (propertyRawDoc) => {
    if (!propertyRawDoc) return undefined;
    // structure : PROP.0.type.names.0
    const returnDesc = _.head(propertyRawDoc.type.names);
    // array: Array.<type>
    // object : type
    if (returnDesc.indexOf('Array') !== -1) {
      return {
        type: 'array',
        model: _.head(/(<).+(>)/g.exec(returnDesc)).slice(1, -1),
        description: propertyRawDoc.description,
      };
    }
    return { type: 'object', model: returnDesc, description: propertyRawDoc.description };
  },
};
