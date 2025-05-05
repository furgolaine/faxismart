const express = require('express');
const router = express.Router();
const Appointment = require('./appointment.model');
const Professional = require('../users/professional.model');
const Client = require('../users/client.model');
const User = require('../users/user.model');

// Middleware para verificar autenticação
const authMiddleware = require('../users/auth.middleware');

// Rota para criar um novo agendamento
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.type !== 'client') {
      return res.status(403).json({ error: 'Apenas clientes podem criar agendamentos' });
    }

    const { professionalId, date, startTime, squareMeters, complexityLevel, notes } = req.body;

    // Buscar cliente
    const client = await Client.findOne({ where: { userId: user.id } });
    if (!client) {
      return res.status(404).json({ error: 'Perfil de cliente não encontrado' });
    }

    // Buscar profissional
    const professional = await Professional.findByPk(professionalId);
    if (!professional) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    // Verificar disponibilidade do profissional
    if (!professional.available) {
      return res.status(400).json({ error: 'Profissional não está disponível' });
    }

    // Calcular preço total baseado na metragem e preço por metro quadrado
    const totalPrice = squareMeters * professional.pricePerSquareMeter * (1 + (complexityLevel - 1) * 0.1);

    // Criar agendamento
    const appointment = await Appointment.create({
      professionalId,
      clientId: client.id,
      date,
      startTime,
      status: 'pending',
      totalPrice,
      squareMeters,
      complexityLevel,
      notes,
      paymentStatus: 'pending'
    });

    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      appointment
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

// Rota para listar agendamentos do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { status } = req.query;
    
    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    let appointments;
    
    if (user.type === 'professional') {
      const professional = await Professional.findOne({ where: { userId: user.id } });
      if (!professional) {
        return res.status(404).json({ error: 'Perfil de profissional não encontrado' });
      }
      
      appointments = await Appointment.findAll({
        where: {
          ...whereClause,
          professionalId: professional.id
        },
        include: [
          {
            model: Client,
            include: [
              {
                model: User,
                attributes: ['name', 'phone', 'profileImage']
              }
            ]
          }
        ],
        order: [['date', 'DESC'], ['startTime', 'DESC']]
      });
    } else if (user.type === 'client') {
      const client = await Client.findOne({ where: { userId: user.id } });
      if (!client) {
        return res.status(404).json({ error: 'Perfil de cliente não encontrado' });
      }
      
      appointments = await Appointment.findAll({
        where: {
          ...whereClause,
          clientId: client.id
        },
        include: [
          {
            model: Professional,
            include: [
              {
                model: User,
                attributes: ['name', 'phone', 'profileImage']
              }
            ]
          }
        ],
        order: [['date', 'DESC'], ['startTime', 'DESC']]
      });
    } else {
      return res.status(403).json({ error: 'Tipo de usuário não autorizado' });
    }

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao listar agendamentos' });
  }
});

// Rota para buscar detalhes de um agendamento
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Professional,
          include: [
            {
              model: User,
              attributes: ['name', 'phone', 'profileImage']
            }
          ]
        },
        {
          model: Client,
          include: [
            {
              model: User,
              attributes: ['name', 'phone', 'profileImage']
            }
          ]
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Verificar se o usuário tem permissão para acessar este agendamento
    if (user.type === 'professional') {
      const professional = await Professional.findOne({ where: { userId: user.id } });
      if (!professional || appointment.professionalId !== professional.id) {
        return res.status(403).json({ error: 'Você não tem permissão para acessar este agendamento' });
      }
    } else if (user.type === 'client') {
      const client = await Client.findOne({ where: { userId: user.id } });
      if (!client || appointment.clientId !== client.id) {
        return res.status(403).json({ error: 'Você não tem permissão para acessar este agendamento' });
      }
    } else {
      return res.status(403).json({ error: 'Tipo de usuário não autorizado' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Erro ao buscar detalhes do agendamento:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do agendamento' });
  }
});

// Rota para atualizar status de um agendamento
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;
    
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Verificar permissões baseado no tipo de usuário e no status desejado
    if (user.type === 'professional') {
      const professional = await Professional.findOne({ where: { userId: user.id } });
      if (!professional || appointment.professionalId !== professional.id) {
        return res.status(403).json({ error: 'Você não tem permissão para atualizar este agendamento' });
      }
      
      // Profissionais podem confirmar, iniciar ou completar agendamentos
      if (!['confirmed', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido para profissional' });
      }
    } else if (user.type === 'client') {
      const client = await Client.findOne({ where: { userId: user.id } });
      if (!client || appointment.clientId !== client.id) {
        return res.status(403).json({ error: 'Você não tem permissão para atualizar este agendamento' });
      }
      
      // Clientes só podem cancelar agendamentos
      if (status !== 'cancelled') {
        return res.status(400).json({ error: 'Clientes só podem cancelar agendamentos' });
      }
      
      // Verificar se o agendamento pode ser cancelado (não pode cancelar se já estiver em andamento ou concluído)
      if (['in_progress', 'completed'].includes(appointment.status)) {
        return res.status(400).json({ error: 'Não é possível cancelar um agendamento em andamento ou concluído' });
      }
    } else {
      return res.status(403).json({ error: 'Tipo de usuário não autorizado' });
    }

    // Atualizar status
    await appointment.update({ status });

    res.json({
      message: 'Status do agendamento atualizado com sucesso',
      appointment
    });
  } catch (error) {
    console.error('Erro ao atualizar status do agendamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do agendamento' });
  }
});

module.exports = router;
