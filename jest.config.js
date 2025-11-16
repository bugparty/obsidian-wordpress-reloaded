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
      branches: 5,
      functions: 8,
      lines: 14,
      statements: 14
    }
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
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
