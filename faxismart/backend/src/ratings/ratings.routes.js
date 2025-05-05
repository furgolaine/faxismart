const express = require('express');
const router = express.Router();
const Rating = require('./rating.model');
const Appointment = require('../appointments/appointment.model');
const Professional = require('../users/professional.model');
const Client = require('../users/client.model');
const User = require('../users/user.model');

// Middleware para verificar autenticação
const authMiddleware = require('../users/auth.middleware');

// Rota para criar uma avaliação
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.type !== 'client') {
      return res.status(403).json({ error: 'Apenas clientes podem criar avaliações' });
    }

    const { appointmentId, rating, comment } = req.body;

    // Validar rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'A avaliação deve ser entre 1 e 5' });
    }

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
      return res.status(403).json({ error: 'Você não tem permissão para avaliar este agendamento' });
    }

    // Verificar se o agendamento foi concluído
    if (appointment.status !== 'completed') {
      return res.status(400).json({ error: 'Apenas agendamentos concluídos podem ser avaliados' });
    }

    // Verificar se já existe uma avaliação para este agendamento
    const existingRating = await Rating.findOne({ where: { appointmentId } });
    if (existingRating) {
      return res.status(400).json({ error: 'Este agendamento já foi avaliado' });
    }

    // Criar avaliação
    const newRating = await Rating.create({
      appointmentId,
      clientId: client.id,
      professionalId: appointment.professionalId,
      rating,
      comment
    });

    // Atualizar média de avaliações do profissional
    const professional = await Professional.findByPk(appointment.professionalId);
    const allRatings = await Rating.findAll({ where: { professionalId: professional.id } });
    
    const totalRatings = allRatings.length;
    const averageRating = allRatings.reduce((sum, item) => sum + item.rating, 0) / totalRatings;
    
    await professional.update({
      averageRating,
      totalRatings
    });

    res.status(201).json({
      message: 'Avaliação criada com sucesso',
      rating: newRating
    });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
});

// Rota para listar avaliações de um profissional
router.get('/professional/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const ratings = await Rating.findAll({
      where: { professionalId: id },
      include: [
        {
          model: Client,
          include: [
            {
              model: User,
              attributes: ['name', 'profileImage']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(ratings);
  } catch (error) {
    console.error('Erro ao listar avaliações:', error);
    res.status(500).json({ error: 'Erro ao listar avaliações' });
  }
});

module.exports = router;
