import docParser from './jsDoc';

export default {
  getClassDescription: async fileDescription => docParser.findByFilter(fileDescription, a => a.kind === 'class' && a.scope === 'global' && !a.undocumented),

  getControllerDescription: async fileDescription => docParser.findByFilter(fileDescription, a => a.kind === 'function' && a.name === 'controller' && !a.undocumented),

  getTypeDescription: async type => docParser.getTypeDescription(type),
};
