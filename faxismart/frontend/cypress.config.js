// Configuração do Cypress para testes end-to-end do Faxismart

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // Configurações de eventos do Cypress
    },
    viewportWidth: 375,
    viewportHeight: 667,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true
  },
  env: {
    apiUrl: 'http://localhost:5000/api'
  }
});
