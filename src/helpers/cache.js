import _ from 'lodash';

const cache = {};
export default {
  get: (type, key) => {
    if (cache[type] && cache[type][key]) return cache[type][key];
    return undefined;
  },
  set: (type, key, value) => {
    if (!cache[type]) cache[type] = {};
    cache[type][key] = value;
  },
  clear: () => {
    _.forOwn(cache, x => delete cache[x]);
  },
};
