const express = require('express');
const router = express.Router();
const Payment = require('./payment.model');
const Appointment = require('../appointments/appointment.model');
const Professional = require('../users/professional.model');
const Client = require('../users/client.model');
const User = require('../users/user.model');
const Referral = require('../referrals/referral.model');

// Middleware para verificar autenticação
const authMiddleware = require('../users/auth.middleware');

// Configuração do Stripe (gateway de pagamento)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_example');

// Rota para processar pagamento
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.type !== 'client') {
      return res.status(403).json({ error: 'Apenas clientes podem realizar pagamentos' });
    }

    const { appointmentId, paymentMethod, paymentToken } = req.body;

    // Buscar cliente
    const client = await Client.findOne({ where: { userId: user.id } });
    if (!client) {
      return res.status(404).json({ error: 'Perfil de cliente não encontrado' });
    }

    // Buscar agendamento
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Verificar se o agendamento pertence ao cliente
    if (appointment.clientId !== client.id) {
      return res.status(403).json({ error: 'Você não tem permissão para pagar este agendamento' });
    }

    // Verificar se o pagamento já foi realizado
    if (appointment.paymentStatus === 'completed') {
      return res.status(400).json({ error: 'Este agendamento já foi pago' });
    }

    // Buscar profissional
    const professional = await Professional.findByPk(appointment.professionalId);
    if (!professional) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    // Calcular taxas
    const amount = appointment.totalPrice;
    const platformFee = amount * 0.10; // 10% para a plataforma
    const professionalAmount = amount - platformFee;

    // Verificar se há referência
    let referralFee = 0;
    if (client.referredBy) {
      referralFee = amount * 0.05; // 5% para quem indicou
    }

    // Processar pagamento com Stripe (simulado)
    let gatewayResponse = {};
    try {
      // Aqui seria a integração real com o Stripe
      gatewayResponse = {
        id: `pay_${Date.now()}`,
        status: 'succeeded',
        amount: amount * 100, // Stripe trabalha com centavos
        currency: 'brl',
        created: Math.floor(Date.now() / 1000)
      };
    } catch (stripeError) {
      return res.status(400).json({ error: 'Erro ao processar pagamento', details: stripeError.message });
    }

    // Criar registro de pagamento
    const payment = await Payment.create({
      appointmentId,
      clientId: client.id,
      professionalId: professional.id,
      amount,
      platformFee,
      referralFee,
      professionalAmount: professionalAmount - referralFee,
      paymentMethod,
      paymentStatus: 'completed',
      gatewayId: gatewayResponse.id,
      gatewayResponse
    });

    // Atualizar status de pagamento do agendamento
    await appointment.update({
      paymentStatus: 'completed',
      paymentId: payment.id
    });

    // Se houver referência, registrar o bônus
    if (client.referredBy && referralFee > 0) {
      await Referral.create({
        professionalId: client.referredBy,
        clientId: client.id,
        code: 'DIRECT', // Indicação direta
        status: 'used',
        usedAt: new Date(),
        bonusAmount: referralFee,
        bonusPaid: true
      });
    }

    res.json({
      message: 'Pagamento processado com sucesso',
      payment
    });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
});

// Rota para listar pagamentos do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    let payments;
    
    if (user.type === 'professional') {
      const professional = await Professional.findOne({ where: { userId: user.id } });
      if (!professional) {
        return res.status(404).json({ error: 'Perfil de profissional não encontrado' });
      }
      
      payments = await Payment.findAll({
        where: {
          professionalId: professional.id
        },
        include: [
          {
            model: Appointment,
            attributes: ['date', 'startTime', 'status']
          },
          {
            model: Client,
            include: [
              {
                model: User,
                attributes: ['name']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else if (user.type === 'client') {
      const client = await Client.findOne({ where: { userId: user.id } });
      if (!client) {
        return res.status(404).json({ error: 'Perfil de cliente não encontrado' });
      }
      
      payments = await Payment.findAll({
        where: {
          clientId: client.id
        },
        include: [
          {
            model: Appointment,
            attributes: ['date', 'startTime', 'status']
          },
          {
            model: Professional,
            include: [
              {
                model: User,
                attributes: ['name']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else {
      return res.status(403).json({ error: 'Tipo de usuário não autorizado' });
    }

    res.json(payments);
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res.status(500).json({ error: 'Erro ao listar pagamentos' });
  }
});

module.exports = router;
