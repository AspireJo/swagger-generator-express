import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import _ from 'lodash';
import YAML from 'yamljs';

const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// save output to disk
export default {
  save: async (config, fileName, data) => {
    const targetFormat = _.lowerCase(_.trimStart(config.format, '.'));
    let ext;
    if (targetFormat === 'json') ext = '.json';
    else if (targetFormat === 'yml' || targetFormat === 'yaml') ext = '.yml';
    if (!ext) throw new Error('unknown output format');
    logger(`saving file ${fileName}${ext}`);
    const fileContent = ext === '.json' ? JSON.stringify(data, null, 2) : YAML.stringify(data, 99, 2);
    const filePath = path.join(config.location, `./${fileName}${ext}`);
    await writeFile(filePath, fileContent);
  },
  load: async (filePath) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    if (await stat(filePath)) return require(filePath);
    throw new Error(`file ${filePath} not found`);
  }
};
