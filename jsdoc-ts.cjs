const { parserOptions } = require('jsdoc/src/astbuilder');

if (!parserOptions.plugins.includes('typescript')) {
  parserOptions.plugins.push('typescript');
}

exports.handlers = {
  parseBegin() {}
};
