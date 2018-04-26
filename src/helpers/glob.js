import glob from 'glob-promise';
import _ from 'lodash';

// returns file name
const getName = file => file.substr(file.lastIndexOf('/')).slice(1).replace('.js', '');

export default {
  list: async pattern => glob(pattern),
  asMap: async (pattern) => {
    const files = await glob(pattern);
    return _.fromPairs(files.map(file => [getName(file), file]));
  }
};
