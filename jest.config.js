module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^obsidian$': '<rootDir>/tests/mocks/obsidian.ts',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^lodash-es$': 'lodash'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest-setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  coverageDirectory: 'coverage',
  testTimeout: 10000,
  // Transform ES modules from node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(lodash-es)/)'
  ],
  // Add transform configuration for TypeScript
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  }
};
