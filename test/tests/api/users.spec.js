import { expect } from 'chai';
import generated from '../../app/documentation/output.json';

describe('users model tests', () => {
  it('should generate users model', () => {
    expect(generated).to.be.not.null;
    expect(generated.paths).to.be.not.null;
    expect(generated.paths['/v1/users']).to.be.not.null;
    expect(generated.paths['/v1/users'].get).to.be.not.null;
  });
  const routeDoc = generated.paths['/v1/users'].get;
  it('should have description', () => {
    expect(routeDoc.description).to.be.not.null;
    expect(routeDoc.description).to.be.eq('Get users list');
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
    expect(response.description).to.be.eq('Get users list Succeed');
    expect(response.schema).to.be.not.null;
    const { schema } = response;
    expect(schema).to.have.any.keys('type');
    expect(schema).to.have.any.keys('items');
    expect(schema.type).to.be.not.null;
    expect(schema.type).to.be.eq('array');
    expect(schema.items).to.be.not.null;
    const { items } = schema;
    expect(items).to.have.any.keys('allOf');
    expect(items.allOf).to.be.an('array');
    expect(items.allOf.length).to.be.eq(1);
    const model = items.allOf[0];
    expect(model).to.be.not.null;
    expect(model).to.have.any.keys('type');
    expect(model).to.have.any.keys('properties');
    expect(model.type).to.be.not.null;
    expect(model.type).to.be.eq('object');
    const { properties } = model;
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
  it('should have aditional responses', () => {
    const { responses } = routeDoc;
    expect(responses).to.have.any.keys('204');
    expect(responses).to.have.any.keys('403');
  });
  it('should have parameters', () => {
    expect(routeDoc).to.have.any.keys('parameters');
    const { parameters } = routeDoc;
    expect(parameters).to.be.not.null;
    expect(parameters).to.be.an('array');
    const offset = parameters.find(a => a.name === 'offset');
    const limit = parameters.find(a => a.name === 'limit');
    expect(offset).to.be.not.null;
    expect(limit).to.be.not.null;
  });
});
