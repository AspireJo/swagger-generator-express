import { expect } from 'chai';
import generated from '../../app/documentation/output.json';

describe('inline model tests', () => {
  it('should generate inline model', () => {
    expect(generated).to.be.not.null;
    expect(generated.paths).to.be.not.null;
    expect(generated.paths['/v1/inline']).to.be.not.null;
    expect(generated.paths['/v1/inline'].get).to.be.not.null;
  });
  const routeDoc = generated.paths['/v1/inline'].get;
  it('should have description', () => {
    expect(routeDoc.description).to.be.not.null;
    expect(routeDoc.description).to.be.eq('Get inline response');
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
    expect(response.description).to.be.eq('Get inline response Succeed');
    expect(response.schema).to.be.not.null;
    const { schema } = response;
    expect(schema.type).to.be.not.null;
    expect(schema.type).to.be.eq('object');
    expect(schema.properties).to.be.not.null;
    const { properties } = schema;
    expect(properties).to.have.any.keys('prop1');
    expect(properties).to.have.any.keys('prop2');
    const { prop1, prop2 } = properties;
    expect(prop1).to.be.not.null;
    expect(prop1).to.have.any.keys('type');
    expect(prop1).to.have.any.keys('description');
    expect(prop1.type).to.be.eq('string');
    expect(prop1.description).to.be.eq('this is first property');
    expect(prop2).to.be.not.null;
    expect(prop2).to.have.any.keys('type');
    expect(prop2).to.have.any.keys('description');
    expect(prop2.type).to.be.eq('boolean');
    expect(prop2.description).to.be.eq('this is sec property');
  });
});
