import jsDoc from './jsDoc';

export default {
  getPropertyType: async property => jsDoc.getTypeDescription(property),
};
