module.exports = function (wallaby) {
  process.env.NODE_ENV = 'test';
  return {
    files: [
      'config/*.json',
      'src/**/*resolver.ts',
      'src/**/*controller.ts',
      'src/**/*service.ts',
      'test/**/*.ts',
      'test/fixtures/*',
      '!/**/*spec.ts?(x)',
      '!src/main.ts',
      '!src/database/**/*',
      '!src/graphql/**/*',
      '!src/api/**/*',
    ],

    tests: [
      'src/**/*controller.spec.ts?(x)',
      'src/**/*service.spec.ts?(x)',
      'src/**/*resolver.spec.ts?(x)',
      'test/**/*spec.ts?(x)',
    ],

    env: {
      type: 'node'
    },
    compilers: {
      'src/**/*.ts?(x)': wallaby.compilers.typeScript({
        module: 'commonjs',
        jsx: 'React',
        isolatedModules: true,
      })
    },

    testFramework: 'jest',
    // setup: function(wallaby) {
    //   const jest = require('./package.json').jest;
    //   delete jest.transform;
    //   wallaby.testFramework.configure(jest);
    // },
    // preprocessors: {
    // '**/*.js?(x)': file => require('babel-core').transform(
    //   file.content,
    //   {sourceMap: true, filename: file.path, compact: false,
    //    babelrc: true, presets: ['babel-preset-jest']})
    // },
    filesWithNoCoverageCalculated: [
      'src/**/*',
      'src/database/database-ormconfig.constant.ts',
      'test/test.utils.ts',
    ],
    runAllTestsInAffectedTestFile: true,
    debug: true,
  };
};
