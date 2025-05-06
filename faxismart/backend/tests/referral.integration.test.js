// Testes de integração para o sistema de referências do Faxismart

const request = require('supertest');
const app = require('../src/main');
const mongoose = require('mongoose');
const Referral = require('../src/referrals/referral.model');
const User = require('../src/users/user.model');

describe('Sistema de Referências - Testes de Integração', () => {
  // Dados de teste
  const testUser1 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Usuário Teste 1',
    email: 'usuario1@teste.com',
    role: 'professional'
  };
  
  const testUser2 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Usuário Teste 2',
    email: 'usuario2@teste.com',
    role: 'client'
  };
  
  // Configuração antes dos testes
  beforeAll(async () => {
    // Conectar ao banco de dados de teste
    await mongoose.connect(process.env.MONGO_URI_TEST);
    
    // Limpar coleções de teste
    await User.deleteMany({});
    await Referral.deleteMany({});
    
    // Criar dados de teste
    await User.create(testUser1);
    await User.create(testUser2);
  });

  // Limpeza após os testes
  afterAll(async () => {
    // Limpar coleções de teste
    await User.deleteMany({});
    await Referral.deleteMany({});
    
    // Desconectar do banco de dados
    await mongoose.connection.close();
  });

  describe('Geração de Código de Referência', () => {
    test('Deve gerar um código de referência para um usuário', async () => {
      const response = await request(app)
        .post(`/api/referrals/generate/${testUser1._id}`);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Código de referência gerado com sucesso');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.referralCode).toBeDefined();
      expect(response.body.data.userId).toBe(testUser1._id.toString());
      
      // Verificar formato do código (FX + 4 letras + 4 números)
      const codeRegex = /^FX[A-Z]{4}\d{4}$/;
      expect(codeRegex.test(response.body.data.referralCode)).toBe(true);
    });

    test('Deve retornar o código existente se o usuário já tiver um', async () => {
      const response = await request(app)
        .post(`/api/referrals/generate/${testUser1._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Código de referência já existe');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.referralCode).toBeDefined();
      expect(response.body.data.userId).toBe(testUser1._id.toString());
    });
  });

  describe('Aplicação de Código de Referência', () => {
    let referralCode;
    
    // Obter o código de referência gerado anteriormente
    beforeAll(async () => {
      const referral = await Referral.findOne({ userId: testUser1._id });
      referralCode = referral.code;
    });
    
    test('Deve aplicar um código de referência com sucesso', async () => {
      const response = await request(app)
        .post(`/api/referrals/apply/${testUser2._id}`)
        .send({ referralCode });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Código de referência aplicado com sucesso');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.referralCode).toBe(referralCode);
      expect(response.body.data.referralUserId).toBe(testUser1._id.toString());
      expect(response.body.data.discountApplied).toBe(true);
    });

    test('Deve impedir que um usuário aplique seu próprio código', async () => {
      const response = await request(app)
        .post(`/api/referrals/apply/${testUser1._id}`)
        .send({ referralCode });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Não é possível usar seu próprio código de referência');
    });

    test('Deve impedir que um usuário aplique mais de um código', async () => {
      const response = await request(app)
        .post(`/api/referrals/apply/${testUser2._id}`)
        .send({ referralCode });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuário já aplicou um código de referência');
    });
  });

  describe('Estatísticas de Referência', () => {
    test('Deve retornar estatísticas de referência para um usuário', async () => {
      const response = await request(app)
        .get(`/api/referrals/stats/${testUser1._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.referralCode).toBeDefined();
      expect(response.body.data.totalReferrals).toBe(1);
      expect(response.body.data.activeReferrals).toBe(1);
      
      // Verificar se os ganhos estão definidos para profissionais
      if (testUser1.role === 'professional') {
        expect(response.body.data.totalEarnings).toBeDefined();
      }
    });

    test('Deve listar usuários referidos por um usuário', async () => {
      const response = await request(app)
        .get(`/api/referrals/users/${testUser1._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // Verificar se o usuário referido está na lista
      const referredUser = response.body.data[0];
      expect(referredUser.userId).toBe(testUser2._id.toString());
      expect(referredUser.status).toBe('active');
    });
  });
});
