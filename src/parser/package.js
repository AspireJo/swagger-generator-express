import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const read = promisify(fs.readFile);

export default async () => {
  const pkgFilePath = path.join(process.cwd(), './package.json');
  if (await stat(pkgFilePath)) {
    logger('parse package.json content');
    const pkg = JSON.parse(await read(pkgFilePath, 'utf8'));
    return {
      version: pkg.version,
      title: pkg.name,
      description: pkg.description,
    };
  }
  throw new Error('Cannot locate package.json');
};
