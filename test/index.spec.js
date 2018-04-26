import { expect } from 'chai';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import init from './init';

const exists = promisify(fs.exists);
const del = promisify(fs.unlink);
const successOutputLocation = path.join(__dirname, './app/documentation/output.json');
const errorOutputLocation = path.join(__dirname, './app/documentation/error.json');

before(async () => {
  if (await exists(successOutputLocation)) await del(successOutputLocation);
  if (await exists(errorOutputLocation)) await del(errorOutputLocation);
  await init();
});

describe('generated output', async () => {
  it('should save sucess output', async () => expect(await exists(successOutputLocation)).to.be.true);
  it('should save sucess output', async () => expect(await exists(errorOutputLocation)).to.be.true);
});
