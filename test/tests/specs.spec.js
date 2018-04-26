import { expect } from 'chai';
import config from './../config/doc';
import defaultConfig from './../../config/specs';
import generated from '../app/documentation/output.json';

describe('specs test', () => {
  it('should parse output files', () => {
    expect(generated).to.not.be.null;
    expect(generated.consumes).to.not.be.null;
    expect(generated.produces).to.not.be.null;
  });
  it('should have swagger version', () => {
    expect(generated.swagger).to.not.be.null;
    expect(generated.swagger).to.be.a('string');
    expect(generated.swagger).to.be.eq(defaultConfig.swagger);
  });
  it('should have basePath', () => {
    expect(generated.basePath).to.not.be.null;
    expect(generated.basePath).to.be.a('string');
    expect(generated.basePath).to.be.eq(defaultConfig.basePath);
  });
  it('should have host', () => {
    expect(generated.host).to.not.be.null;
    expect(generated.host).to.be.a('string');
    expect(generated.host).to.be.eq(config.specs.host);
  });
  it('should have schemes', () => {
    expect(generated.schemes).to.not.be.null;
    expect(generated.schemes).to.be.an('array');
    expect(generated.schemes.length).to.be.eq(defaultConfig.schemes.length);
    defaultConfig.schemes.forEach((scheme) => {
      expect(generated.schemes).to.include(scheme);
    });
  });
  it('should have consumes', () => {
    expect(generated.consumes).to.not.be.null;
    expect(generated.consumes).to.be.an('array');
    expect(generated.consumes.length).to.be.eq(defaultConfig.consumes.length);
    defaultConfig.consumes.forEach((c) => {
      expect(generated.consumes).to.include(c);
    });
  });
  it('should have produces', () => {
    expect(generated.produces).to.not.be.null;
    expect(generated.produces).to.be.an('array');
    expect(generated.produces.length).to.be.eq(defaultConfig.produces.length);
    defaultConfig.produces.forEach((p) => {
      expect(generated.produces).to.include(p);
    });
  });
});
