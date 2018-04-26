// Custom erros
export default {
  undocumented: (file, message) => ({
    file: file.slice(file.indexOf('/app/')),
    message,
    code: -1001,
  }),
  unkonwn: (name, type) => ({
    file: name,
    message: `unknown ${type} ${name}`,
    code: -1002,
  })
};
