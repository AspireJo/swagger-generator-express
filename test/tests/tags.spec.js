import { expect } from 'chai';
import config from './../config/doc';
import generated from '../app/documentation/output.json';

describe('tags test', () => {
  it('should have tags', () => {
    expect(generated).to.not.be.null;
    expect(generated.tags).to.not.be.null;
  });
  const { tags } = generated;
  it('should match config tags', () => {
    expect(tags).to.be.an('array');
    expect(tags.length).to.be.eq(config.tags.length);
    config.tags.forEach((tag) => {
      expect(tags).to.deep.include(tag);
    });
  });
});
