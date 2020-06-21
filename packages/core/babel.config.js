const fs = require('fs');

const babelConfig = JSON.parse(fs.readFileSync('../../.babelrc'));

module.exports = (api) => {
  const isTest = api.env('test');

  return {
    ...babelConfig,
    ...(isTest ? {ignore: null} : {}),
  };
};
