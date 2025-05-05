const express = require('express');
const router = express.Router();
const User = require('../users/user.model');
const Professional = require('../users/professional.model');
const Client = require('../users/client.model');
const Appointment = require('../appointments/appointment.model');
const Payment = require('../payments/payment.model');

// Middleware para verificar autenticação
const authMiddleware = require('../users/auth.middleware');

// Middleware para verificar se é admin
const adminMiddleware = (req, res, next) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  next();
};

// Rota para listar todos os usuários
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    if (status) whereClause.status = status;
    if (type) whereClause.type = type;
    
    const users = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      total: users.count,
      pages: Math.ceil(users.count / limit),
      currentPage: parseInt(page),
      users: users.rows
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Rota para aprovar cadastro de profissional
router.put('/professionals/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const professional = await Professional.findByPk(id, {
      include: [{ model: User }]
    });
    
    if (!professional) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }
    
    if (professional.User.status === 'active') {
      return res.status(400).json({ error: 'Profissional já está aprovado' });
    }
    
    // Atualizar status do usuário
    await professional.User.update({ status: 'active' });
    
    // Atualizar verificação de documento
    await professional.update({ documentVerified: true });
    
    res.json({
      message: 'Profissional aprovado com sucesso',
      professional
    });
  } catch (error) {
    console.error('Erro ao aprovar profissional:', error);
    res.status(500).json({ error: 'Erro ao aprovar profissional' });
  }
});

// Rota para bloquear usuário
router.put('/users/:id/block', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    await user.update({ 
      status: 'blocked',
      blockReason: reason || 'Bloqueado por administrador'
    });
    
    res.json({
      message: 'Usuário bloqueado com sucesso',
      user
    });
  } catch (error) {
    console.error('Erro ao bloquear usuário:', error);
    res.status(500).json({ error: 'Erro ao bloquear usuário' });
  }
});

// Rota para obter estatísticas do sistema
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Contagem de usuários
    const totalUsers = await User.count();
    const totalProfessionals = await User.count({ where: { type: 'professional' } });
    const totalClients = await User.count({ where: { type: 'client' } });
    
    // Contagem de agendamentos
    const totalAppointments = await Appointment.count();
    const pendingAppointments = await Appointment.count({ where: { status: 'pending' } });
    const completedAppointments = await Appointment.count({ where: { status: 'completed' } });
    
    // Dados financeiros
    const totalPayments = await Payment.sum('amount');
    const platformRevenue = await Payment.sum('platformFee');
    const referralFees = await Payment.sum('referralFee');
    
    res.json({
      users: {
        total: totalUsers,
        professionals: totalProfessionals,
        clients: totalClients
      },
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        completed: completedAppointments
      },
      financial: {
        totalPayments: totalPayments || 0,
        platformRevenue: platformRevenue || 0,
        referralFees: referralFees || 0
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
});

module.exports = router;
