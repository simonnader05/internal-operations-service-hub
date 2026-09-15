import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],

  rootDir: '.',

  testRegex: '.*\\.spec\\.ts$',

  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          target: 'ES2023',
          esModuleInterop: true,
          isolatedModules: true
        }
      }
    ]
  },

  testEnvironment: 'node',

  coverageDirectory: './coverage'
};

export default config;