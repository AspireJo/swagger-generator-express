import _ from 'lodash';

const parseValue = (value, type) => {
  if (type === 'string') return _.trim(value);
  if (type === 'integer') return parseInt(_.trim(value), 10);
  if (type === 'float' || type === 'number') return parseFloat(_.trim(value));
  if (type === 'boolean') return _.trim(value).toLowerCase() === 'true';
  return value;
};

export default async (typeDesc, value) => {
  if (typeDesc.type === 'array') return value.split(',').map(a => parseValue(a, typeDesc.model));
  return parseValue(value, typeDesc.model);
};
