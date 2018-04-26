'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findAllByName = async function findAllByName(jsDoc, propName) {
  return _lodash2.default.entries(_lodash2.default.pickBy(jsDoc.properties, { name: propName })).map(function (item) {
    return _lodash2.default.mapKeys(item, function () {
      return 'val';
    }).val;
  });
};

exports.default = {
  // return all items by filter
  findByFilter: async function findByFilter(rawDoc, predicate) {
    var docsArray = _lodash2.default.toPairs(rawDoc).map(function (a) {
      return a[1];
    });
    return _lodash2.default.head(_lodash2.default.filter(docsArray, predicate));
  },

  // returns all items by name
  findTagByName: async function findTagByName(rawDoc, propName) {
    var all = await findAllByName(rawDoc, propName);
    return (_lodash2.default.head(all) || { description: '' }).description.split(',').map(function (item) {
      return item.trim();
    }).filter(function (a) {
      return a !== '';
    });
  },

  // return type properties
  // {type:array|object, model:model_name, description:property_description}
  getTypeDescription: async function getTypeDescription(propertyRawDoc) {
    if (!propertyRawDoc) return undefined;
    // structure : PROP.0.type.names.0
    var returnDesc = _lodash2.default.head(propertyRawDoc.type.names);
    // array: Array.<type>
    // object : type
    if (returnDesc.indexOf('Array') !== -1) {
      return {
        type: 'array',
        model: _lodash2.default.head(/(<).+(>)/g.exec(returnDesc)).slice(1, -1),
        description: propertyRawDoc.description
      };
    }
    return { type: 'object', model: returnDesc, description: propertyRawDoc.description };
  }
};