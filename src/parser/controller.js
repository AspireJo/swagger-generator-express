import _ from 'lodash';
import docParser from './jsDoc';

export default {
  // returns return model info
  getReturnModel: async documentaion => docParser.getTypeDescription(_.head(documentaion.returns)),

  // returns tags list
  getTags: async documentaion => docParser.findTagByName(documentaion, 'tags'),

  // returns routes list
  getRoute: async documentaion => docParser.findTagByName(documentaion, 'route'),

  // returns schemas list
  getSchemas: async documentaion => docParser.findTagByName(documentaion, 'schema'),

  // returns respose codes list
  getResponses: async documentaion => docParser.findTagByName(documentaion, 'responseCodes'),
};
