// Testes de integração para o sistema de pagamentos do Faxismart

const request = require('supertest');
const app = require('../src/main');
const mongoose = require('mongoose');
const Payment = require('../src/payments/payment.model');
const User = require('../src/users/user.model');
const Appointment = require('../src/appointments/appointment.model');

describe('Sistema de Pagamentos - Testes de Integração', () => {
  // Dados de teste
  const testClient = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Cliente Teste',
    email: 'cliente@teste.com',
    role: 'client'
  };
  
  const testProfessional = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Profissional Teste',
    email: 'profissional@teste.com',
    role: 'professional'
  };
  
  const testAppointment = {
    _id: new mongoose.Types.ObjectId(),
    clientId: testClient._id,
    professionalId: testProfessional._id,
    date: new Date('2025-05-01'),
    time: '09:00',
    squareMeters: 80,
    complexityLevel: 2,
    status: 'confirmed'
  };

  // Configuração antes dos testes
  beforeAll(async () => {
    // Conectar ao banco de dados de teste
    await mongoose.connect(process.env.MONGO_URI_TEST);
    
    // Limpar coleções de teste
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await Payment.deleteMany({});
    
    // Criar dados de teste
    await User.create(testClient);
    await User.create(testProfessional);
    await Appointment.create(testAppointment);
  });

  // Limpeza após os testes
  afterAll(async () => {
    // Limpar coleções de teste
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await Payment.deleteMany({});
    
    // Desconectar do banco de dados
    await mongoose.connection.close();
  });

  describe('Cálculo de Preço', () => {
    test('Deve calcular corretamente o preço de um serviço', async () => {
      const response = await request(app)
        .post('/api/payments/calculate')
        .send({
          squareMeters: 80,
          complexityLevel: 2,
          hasReferral: false,
          hasDiscount: false
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      const { pricing, distribution } = response.body.data;
      
      // Verificação do preço
      expect(pricing.squareMeters).toBe(80);
      expect(pricing.complexityLevel).toBe(2);
      expect(pricing.totalPrice).toBe(132); // 80 * 1.5 * 1.1 = 132
      
      // Verificação da distribuição
      expect(distribution.platformFee).toBe(13.2); // 15% de 132
      expect(distribution.referralFee).toBe(0); // Sem referência
      expect(distribution.professionalAmount).toBe(118.8); // 132 - 13.2 = 118.8
    });

    test('Deve calcular corretamente o preço com referência e desconto', async () => {
      const response = await request(app)
        .post('/api/payments/calculate')
        .send({
          squareMeters: 80,
          complexityLevel: 2,
          hasReferral: true,
          hasDiscount: true
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      const { pricing, distribution } = response.body.data;
      
      // Verificação do preço com desconto
      expect(pricing.hasDiscount).toBe(true);
      expect(pricing.totalPrice).toBe(118.8); // 132 * 0.9 = 118.8
      
      // Verificação da distribuição com referência
      expect(distribution.hasReferral).toBe(true);
      expect(distribution.platformFee).toBe(11.88); // 15% de 118.8
      expect(distribution.referralFee).toBe(5.94); // 5% de 118.8
      expect(distribution.professionalAmount).toBe(100.98); // 118.8 - 11.88 - 5.94 = 100.98
    });
  });

  describe('Processamento de Pagamento', () => {
    test('Deve processar um pagamento com sucesso', async () => {
      const response = await request(app)
        .post('/api/payments/process')
        .send({
          appointmentId: testAppointment._id,
          clientId: testClient._id,
          professionalId: testProfessional._id,
          squareMeters: 80,
          complexityLevel: 2,
          paymentMethod: 'credit_card',
          cardDetails: {
            number: '4111111111111111',
            name: 'Cliente Teste',
            expiry: '12/25',
            cvv: '123'
          }
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Pagamento processado com sucesso');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.paymentId).toBeDefined();
      expect(response.body.data.transactionId).toBeDefined();
      expect(response.body.data.amount).toBeDefined();
      expect(response.body.data.status).toBe('completed');
    });

    test('Deve retornar erro para dados incompletos', async () => {
      const response = await request(app)
        .post('/api/payments/process')
        .send({
          appointmentId: testAppointment._id,
          // Dados incompletos
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Dados incompletos para processamento do pagamento');
    });
  });

  describe('Histórico de Pagamentos', () => {
    test('Deve retornar o histórico de pagamentos de um cliente', async () => {
      const response = await request(app)
        .get(`/api/payments/client/${testClient._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // Verificar se o pagamento criado anteriormente está no histórico
      if (response.body.data.length > 0) {
        const payment = response.body.data[0];
        expect(payment.clientId.toString()).toBe(testClient._id.toString());
        expect(payment.professionalId.toString()).toBe(testProfessional._id.toString());
        expect(payment.appointmentId.toString()).toBe(testAppointment._id.toString());
      }
    });

    test('Deve retornar o histórico de ganhos de um profissional', async () => {
      const response = await request(app)
        .get(`/api/payments/professional/${testProfessional._id}?period=all`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalServices).toBeDefined();
      expect(response.body.data.totalEarnings).toBeDefined();
      expect(response.body.data.payments).toBeInstanceOf(Array);
      
      // Verificar se o pagamento criado anteriormente está no histórico
      if (response.body.data.payments.length > 0) {
        const payment = response.body.data.payments[0];
        expect(payment.professionalId.toString()).toBe(testProfessional._id.toString());
      }
    });
  });
});
