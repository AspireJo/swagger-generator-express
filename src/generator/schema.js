import readers from './../reader';

export default {
  getSchemaDescription: async (filePath) => {
    const cached = cache.get('schema', filePath);
    if (cached) return cached;
    logger(`generate schema ${filePath} documentation`);
    const rawDoc = await readers.jsDoc(filePath);
    const scehmaDesc = {
      file: filePath,
      // eslint-disable-next-line global-require, import/no-dynamic-require
      schema: require(filePath),
      docs: rawDoc.filter(item => (item.kind === 'member' || item.kind === 'constant') && (item.scope === 'static' || item.scope === 'global') && !item.undocumented),
    };
    cache.set('schema', filePath, scehmaDesc);
    return scehmaDesc;
  }
};
