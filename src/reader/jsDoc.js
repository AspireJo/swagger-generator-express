import _ from 'lodash';
import path from 'path';
import jsdocApi from 'jsdoc-api';

// returns raw documentation
export default (file) => {
  const ext = _.endsWith(file, '.js') ? '' : '.js';
  logger(`read raw documentation for ${file}${ext}`);
  return jsdocApi.explain({
    files: `${file}${ext}`,
    configure: path.join(__dirname, './../../config/jsdoc.conf'),
  });
};
