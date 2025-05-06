// Configuração para execução dos testes do sistema financeiro
const jest = require('jest');

// Configuração do Jest
const config = {
  verbose: true,
  testMatch: ['**/tests/**/*.test.js'],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/**/index.js'
  ]
};

// Executa os testes
jest.runCLI(config, ['.']);
