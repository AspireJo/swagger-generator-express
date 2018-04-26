import { expect } from 'chai';
import generated from '../../app/documentation/output.json';

describe('users model tests', () => {
  it('should generate users model', () => {
    expect(generated).to.be.not.null;
    expect(generated).to.have.any.keys('paths');
    expect(generated.paths).to.be.not.null;
    expect(generated.paths).to.have.any.keys('/v1/users/{id}');
    expect(generated.paths['/v1/users/{id}']).to.be.not.null;
    expect(generated.paths['/v1/users/{id}']).to.have.any.keys('get');
    expect(generated.paths['/v1/users/{id}'].get).to.be.not.null;
  });
  const routeDoc = generated.paths['/v1/users/{id}'].get;
  it('should have description', () => {
    expect(routeDoc).to.have.any.keys('description');
    expect(routeDoc.description).to.be.not.null;
    expect(routeDoc.description).to.be.eq('Get user info');
  });
  it('should have Users tag', () => {
    const { tags } = routeDoc;
    expect(tags).to.be.not.null;
    expect(tags).to.be.an('array');
    expect(tags.length).to.be.eq(1);
    expect(tags).to.include('Users');
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
    expect(response.description).to.be.eq('Get user info Succeed');
    expect(response.schema).to.be.not.null;
    const { schema } = response;
    expect(schema).to.have.any.keys('type');
    expect(schema).to.have.any.keys('properties');
    expect(schema.type).to.be.not.null;
    expect(schema.type).to.be.eq('object');
    expect(schema.properties).to.be.not.null;
    const { properties } = schema;
    expect(properties).to.be.not.null;
    expect(properties).to.have.any.keys('id');
    expect(properties).to.have.any.keys('email');
    expect(properties).to.have.any.keys('firstName');
    expect(properties).to.have.any.keys('lastName');
    expect(properties.id).to.have.any.keys('type');
    expect(properties.id).to.have.any.keys('description');
    expect(properties.id.type).to.be.eq('number');
    expect(properties.id.description).to.be.eq('User id');
    expect(properties.email).to.have.any.keys('type');
    expect(properties.email).to.have.any.keys('description');
    expect(properties.email.type).to.be.eq('string');
    expect(properties.email.description).to.be.eq('User email address');
    expect(properties.firstName).to.have.any.keys('type');
    expect(properties.firstName).to.have.any.keys('description');
    expect(properties.firstName.type).to.be.eq('string');
    expect(properties.firstName.description).to.be.eq('User first name');
    expect(properties.lastName).to.have.any.keys('type');
    expect(properties.lastName).to.have.any.keys('description');
    expect(properties.lastName.type).to.be.eq('string');
    expect(properties.lastName.description).to.be.eq('User last name');
  });
  it('should not have aditional responses', () => {
    const { responses } = routeDoc;
    expect(responses).to.have.not.any.keys('204');
    expect(responses).to.have.not.any.keys('403');
  });
  it('should not have parameters', () => {
    expect(routeDoc).to.have.any.keys('parameters');
    const { parameters } = routeDoc;
    expect(parameters).to.be.not.null;
    expect(parameters).to.be.an('array');
    expect(parameters.length).to.be.eq(0);
  });
});
