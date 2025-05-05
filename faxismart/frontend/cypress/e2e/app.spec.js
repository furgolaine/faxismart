// Testes end-to-end para o aplicativo Faxismart

describe('Faxismart - Testes End-to-End', () => {
  beforeEach(() => {
    // Limpar cookies e armazenamento local antes de cada teste
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Fluxo de Registro e Login', () => {
    it('Deve permitir que um novo cliente se registre', () => {
      cy.visit('/register');
      cy.get('[data-testid="user-type-client"]').click();
      cy.get('[data-testid="name-input"]').type('Cliente Teste');
      cy.get('[data-testid="email-input"]').type('cliente@teste.com');
      cy.get('[data-testid="password-input"]').type('senha123');
      cy.get('[data-testid="confirm-password-input"]').type('senha123');
      cy.get('[data-testid="phone-input"]').type('11987654321');
      cy.get('[data-testid="register-button"]').click();
      
      // Verificar redirecionamento para a tela de detalhes do cliente
      cy.url().should('include', '/register-client');
      
      // Preencher detalhes do cliente
      cy.get('[data-testid="address-input"]').type('Rua Teste');
      cy.get('[data-testid="address-number-input"]').type('123');
      cy.get('[data-testid="neighborhood-input"]').type('Bairro Teste');
      cy.get('[data-testid="city-input"]').type('São Paulo');
      cy.get('[data-testid="state-input"]').type('SP');
      cy.get('[data-testid="zipcode-input"]').type('01234567');
      cy.get('[data-testid="complete-register-button"]').click();
      
      // Verificar redirecionamento para a tela inicial do cliente
      cy.url().should('include', '/client/home');
    });

    it('Deve permitir que um novo profissional se registre', () => {
      cy.visit('/register');
      cy.get('[data-testid="user-type-professional"]').click();
      cy.get('[data-testid="name-input"]').type('Profissional Teste');
      cy.get('[data-testid="email-input"]').type('profissional@teste.com');
      cy.get('[data-testid="password-input"]').type('senha123');
      cy.get('[data-testid="confirm-password-input"]').type('senha123');
      cy.get('[data-testid="phone-input"]').type('11987654321');
      cy.get('[data-testid="register-button"]').click();
      
      // Verificar redirecionamento para a tela de detalhes do profissional
      cy.url().should('include', '/register-professional');
      
      // Preencher detalhes do profissional
      cy.get('[data-testid="address-input"]').type('Rua Teste');
      cy.get('[data-testid="address-number-input"]').type('123');
      cy.get('[data-testid="neighborhood-input"]').type('Bairro Teste');
      cy.get('[data-testid="city-input"]').type('São Paulo');
      cy.get('[data-testid="state-input"]').type('SP');
      cy.get('[data-testid="zipcode-input"]').type('01234567');
      cy.get('[data-testid="cpf-input"]').type('12345678900');
      cy.get('[data-testid="bank-input"]').type('Banco Teste');
      cy.get('[data-testid="agency-input"]').type('1234');
      cy.get('[data-testid="account-input"]').type('12345-6');
      cy.get('[data-testid="complete-register-button"]').click();
      
      // Verificar redirecionamento para a tela inicial do profissional
      cy.url().should('include', '/professional/home');
    });

    it('Deve permitir que um usuário faça login', () => {
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('cliente@teste.com');
      cy.get('[data-testid="password-input"]').type('senha123');
      cy.get('[data-testid="login-button"]').click();
      
      // Verificar redirecionamento para a tela inicial
      cy.url().should('include', '/client/home');
    });
  });

  describe('Fluxo de Cliente', () => {
    beforeEach(() => {
      // Fazer login como cliente antes de cada teste
      cy.login('cliente@teste.com', 'senha123');
    });

    it('Deve permitir que um cliente busque profissionais', () => {
      cy.visit('/client/home');
      cy.get('[data-testid="search-input"]').type('Limpeza');
      cy.get('[data-testid="search-button"]').click();
      
      // Verificar se a lista de profissionais é exibida
      cy.get('[data-testid="professionals-list"]').should('be.visible');
      cy.get('[data-testid="professional-card"]').should('have.length.at.least', 1);
    });

    it('Deve permitir que um cliente veja detalhes de um profissional', () => {
      cy.visit('/client/home');
      cy.get('[data-testid="professional-card"]').first().click();
      
      // Verificar se os detalhes do profissional são exibidos
      cy.url().should('include', '/client/professional-details');
      cy.get('[data-testid="professional-name"]').should('be.visible');
      cy.get('[data-testid="professional-rating"]').should('be.visible');
      cy.get('[data-testid="book-button"]').should('be.visible');
    });

    it('Deve permitir que um cliente agende um serviço', () => {
      cy.visit('/client/professional-details/1');
      cy.get('[data-testid="book-button"]').click();
      
      // Preencher formulário de agendamento
      cy.url().should('include', '/client/booking');
      cy.get('[data-testid="date-input"]').type('2025-05-01');
      cy.get('[data-testid="time-input"]').select('09:00');
      cy.get('[data-testid="square-meters-input"]').type('80');
      cy.get('[data-testid="complexity-level"]').select('2');
      cy.get('[data-testid="calculate-button"]').click();
      
      // Verificar se o preço é calculado e exibido
      cy.get('[data-testid="price-details"]').should('be.visible');
      cy.get('[data-testid="total-price"]').should('contain', 'R$');
      
      // Confirmar agendamento
      cy.get('[data-testid="confirm-booking-button"]').click();
      
      // Verificar redirecionamento para a tela de pagamento
      cy.url().should('include', '/client/payment');
    });

    it('Deve permitir que um cliente realize um pagamento', () => {
      cy.visit('/client/payment/1');
      
      // Preencher dados de pagamento
      cy.get('[data-testid="payment-method-credit"]').click();
      cy.get('[data-testid="card-number-input"]').type('4111111111111111');
      cy.get('[data-testid="card-name-input"]').type('Cliente Teste');
      cy.get('[data-testid="card-expiry-input"]').type('12/25');
      cy.get('[data-testid="card-cvv-input"]').type('123');
      cy.get('[data-testid="process-payment-button"]').click();
      
      // Verificar confirmação de pagamento
      cy.get('[data-testid="payment-success-message"]').should('be.visible');
      cy.get('[data-testid="view-appointment-button"]').should('be.visible');
    });

    it('Deve permitir que um cliente veja seus agendamentos', () => {
      cy.visit('/client/appointments');
      
      // Verificar se a lista de agendamentos é exibida
      cy.get('[data-testid="appointments-list"]').should('be.visible');
      cy.get('[data-testid="appointment-card"]').should('have.length.at.least', 1);
    });

    it('Deve permitir que um cliente avalie um serviço concluído', () => {
      cy.visit('/client/appointment-details/1');
      
      // Verificar se o serviço está concluído
      cy.get('[data-testid="appointment-status"]').should('contain', 'Concluído');
      
      // Avaliar o serviço
      cy.get('[data-testid="rating-5"]').click();
      cy.get('[data-testid="rating-comment"]').type('Ótimo serviço!');
      cy.get('[data-testid="submit-rating-button"]').click();
      
      // Verificar confirmação de avaliação
      cy.get('[data-testid="rating-success-message"]').should('be.visible');
    });
  });

  describe('Fluxo de Profissional', () => {
    beforeEach(() => {
      // Fazer login como profissional antes de cada teste
      cy.login('profissional@teste.com', 'senha123');
    });

    it('Deve permitir que um profissional veja solicitações de serviço', () => {
      cy.visit('/professional/home');
      
      // Verificar se a lista de solicitações é exibida
      cy.get('[data-testid="requests-list"]').should('be.visible');
    });

    it('Deve permitir que um profissional aceite uma solicitação', () => {
      cy.visit('/professional/request-details/1');
      
      // Verificar detalhes da solicitação
      cy.get('[data-testid="request-details"]').should('be.visible');
      cy.get('[data-testid="request-price"]').should('contain', 'R$');
      
      // Aceitar a solicitação
      cy.get('[data-testid="accept-request-button"]').click();
      
      // Verificar confirmação
      cy.get('[data-testid="accept-success-message"]').should('be.visible');
    });

    it('Deve permitir que um profissional veja seus agendamentos', () => {
      cy.visit('/professional/appointments');
      
      // Verificar se a lista de agendamentos é exibida
      cy.get('[data-testid="appointments-list"]').should('be.visible');
      cy.get('[data-testid="appointment-card"]').should('have.length.at.least', 1);
    });

    it('Deve permitir que um profissional veja seus ganhos', () => {
      cy.visit('/professional/earnings');
      
      // Verificar se o resumo de ganhos é exibido
      cy.get('[data-testid="earnings-summary"]').should('be.visible');
      cy.get('[data-testid="total-earnings"]').should('contain', 'R$');
      cy.get('[data-testid="earnings-list"]').should('be.visible');
    });

    it('Deve permitir que um profissional gerencie suas indicações', () => {
      cy.visit('/professional/referrals');
      
      // Verificar se o código de referência é exibido
      cy.get('[data-testid="referral-code"]').should('be.visible');
      
      // Verificar se as estatísticas de indicação são exibidas
      cy.get('[data-testid="referral-stats"]').should('be.visible');
      cy.get('[data-testid="total-referrals"]').should('be.visible');
      cy.get('[data-testid="referral-earnings"]').should('be.visible');
    });
  });
});

// Comando personalizado para login
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      email,
      password
    }
  }).then((response) => {
    localStorage.setItem('token', response.body.token);
  });
});
