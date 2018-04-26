import { expect } from 'chai';
import pkg from './../../package.json';
import generated from '../app/documentation/output.json';

describe('package info test', () => {
  it('should generate app info', () => {
    expect(generated).to.be.not.null;
    expect(generated.info).to.be.not.null;
  });
  const { info } = generated;
  it('should match app version', () => {
    expect(info.version).to.be.not.null;
    expect(info.version).to.be.a('string');
    expect(info.version).to.be.eq(pkg.version);
  });
  it('should match app name', () => {
    expect(info.title).to.be.not.null;
    expect(info.title).to.be.a('string');
    expect(info.title).to.be.eq(pkg.name);
  });
  it('should match app description', () => {
    expect(info.description).to.be.not.null;
    expect(info.description).to.be.a('string');
    expect(info.description).to.be.eq(pkg.description);
  });
});
