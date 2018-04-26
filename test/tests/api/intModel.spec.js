import { expect } from 'chai';
import generated from '../../app/documentation/output.json';

describe('int model tests', () => {
  it('should generate int model', () => {
    expect(generated).to.be.not.null;
    expect(generated.paths).to.be.not.null;
    expect(generated.paths['/v1/int']).to.be.not.null;
    expect(generated.paths['/v1/int'].get).to.be.not.null;
  });
  const routeDoc = generated.paths['/v1/int'].get;
  it('should have description', () => {
    expect(routeDoc.description).to.be.not.null;
    expect(routeDoc.description).to.be.eq('Get int response');
  });
  it('should have Tests tag', () => {
    const { tags } = routeDoc;
    expect(tags).to.be.not.null;
    expect(tags).to.be.an('array');
    expect(tags.length).to.be.eq(1);
    expect(tags).to.include('Tests');
  });
  it('should have responses', () => {
    expect(routeDoc.responses).to.be.not.null;
  });
  it('should have error response', () => {
    const { responses } = routeDoc;
    expect(responses).to.have.any.keys('400');
    expect(responses).to.have.any.keys('500');
  });
  it('should have success response', () => {
    expect(routeDoc.responses).to.have.any.keys('200');
    const response = routeDoc.responses['200'];
    expect(response.description).to.be.not.null;
    expect(response.description).to.be.a('string');
    expect(response.description).to.be.eq('Get int response Succeed');
    expect(response.schema).to.be.not.null;
    const { schema } = response;
    expect(schema.type).to.be.not.null;
    expect(schema.type).to.be.eq('object');
    expect(schema.properties).to.be.not.null;
    const { properties } = schema;
    expect(properties).to.have.any.keys('type');
    expect(properties.type).to.be.eq('integer');
  });
});
