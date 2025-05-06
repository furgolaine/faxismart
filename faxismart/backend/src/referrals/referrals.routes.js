const express = require('express');
const router = express.Router();
const Referral = require('./referral.model');
const Professional = require('../users/professional.model');
const Client = require('../users/client.model');
const User = require('../users/user.model');
const { v4: uuidv4 } = require('uuid');

// Middleware para verificar autenticação
const authMiddleware = require('../users/auth.middleware');

// Rota para gerar código de referência
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.type !== 'professional') {
      return res.status(403).json({ error: 'Apenas profissionais podem gerar códigos de referência' });
    }

    // Buscar profissional
    const professional = await Professional.findOne({ where: { userId: user.id } });
    if (!professional) {
      return res.status(404).json({ error: 'Perfil de profissional não encontrado' });
    }

    // Verificar se já tem um código
    if (professional.referralCode) {
      return res.json({
        message: 'Você já possui um código de referência',
        code: professional.referralCode
      });
    }

    // Gerar código único
    const code = `FX${user.name.substring(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Atualizar profissional com o código
    await professional.update({ referralCode: code });

    res.json({
      message: 'Código de referência gerado com sucesso',
      code
    });
  } catch (error) {
    console.error('Erro ao gerar código de referência:', error);
    res.status(500).json({ error: 'Erro ao gerar código de referência' });
  }
});

// Rota para listar referências do profissional
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.type !== 'professional') {
      return res.status(403).json({ error: 'Apenas profissionais podem acessar suas referências' });
    }

    // Buscar profissional
    const professional = await Professional.findOne({ where: { userId: user.id } });
    if (!professional) {
      return res.status(404).json({ error: 'Perfil de profissional não encontrado' });
    }

    // Buscar referências
    const referrals = await Referral.findAll({
      where: { professionalId: professional.id },
      include: [
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

    res.json(referrals);
  } catch (error) {
    console.error('Erro ao listar referências:', error);
    res.status(500).json({ error: 'Erro ao listar referências' });
  }
});

// Rota para aplicar código de referência
router.post('/apply', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { code } = req.body;
    
    if (user.type !== 'client') {
      return res.status(403).json({ error: 'Apenas clientes podem aplicar códigos de referência' });
    }

    // Buscar cliente
    const client = await Client.findOne({ where: { userId: user.id } });
    if (!client) {
      return res.status(404).json({ error: 'Perfil de cliente não encontrado' });
    }

    // Verificar se já foi referido
    if (client.referredBy) {
      return res.status(400).json({ error: 'Você já utilizou um código de referência' });
    }

    // Buscar profissional pelo código
    const professional = await Professional.findOne({ where: { referralCode: code } });
    if (!professional) {
      return res.status(404).json({ error: 'Código de referência inválido' });
    }

    // Verificar se não está se auto-referindo
    if (professional.userId === user.id) {
      return res.status(400).json({ error: 'Você não pode usar seu próprio código de referência' });
    }

    // Atualizar cliente com a referência
    await client.update({ referredBy: professional.id });

    // Criar registro de referência
    await Referral.create({
      professionalId: professional.id,
      clientId: client.id,
      code,
      status: 'active'
    });

    res.json({
      message: 'Código de referência aplicado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao aplicar código de referência:', error);
    res.status(500).json({ error: 'Erro ao aplicar código de referência' });
  }
});

// Rota para obter estatísticas de referências
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.type !== 'professional') {
      return res.status(403).json({ error: 'Apenas profissionais podem acessar estatísticas de referências' });
    }

    // Buscar profissional
    const professional = await Professional.findOne({ where: { userId: user.id } });
    if (!professional) {
      return res.status(404).json({ error: 'Perfil de profissional não encontrado' });
    }

    // Contar referências
    const totalReferrals = await Referral.count({ where: { professionalId: professional.id } });
    const activeReferrals = await Referral.count({ where: { professionalId: professional.id, status: 'active' } });
    const usedReferrals = await Referral.count({ where: { professionalId: professional.id, status: 'used' } });
    
    // Calcular ganhos
    const totalEarnings = await Referral.sum('bonusAmount', { where: { professionalId: professional.id, bonusPaid: true } });

    res.json({
      totalReferrals,
      activeReferrals,
      usedReferrals,
      totalEarnings: totalEarnings || 0,
      referralCode: professional.referralCode
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas de referências:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas de referências' });
  }
});

module.exports = router;
