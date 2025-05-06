const express = require('express');
const router = express.Router();
const { sequelize } = require('../../database/config');
const Professional = require('../users/professional.model');
const User = require('../users/user.model');

// Middleware para verificar autenticação
const authMiddleware = require('../users/auth.middleware');

// Rota para buscar profissionais próximos
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius em km, padrão 10km

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude e longitude são obrigatórios' });
    }

    // Buscar profissionais disponíveis próximos usando cálculo de distância
    const professionals = await Professional.findAll({
      where: {
        available: true,
        documentVerified: true
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'profileImage'],
          where: {
            status: 'active'
          }
        }
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`
              6371 * acos(
                cos(radians(${lat})) * 
                cos(radians(latitude)) * 
                cos(radians(longitude) - radians(${lng})) + 
                sin(radians(${lat})) * 
                sin(radians(latitude))
              )
            `),
            'distance'
          ]
        ]
      },
      having: sequelize.literal(`distance < ${radius}`),
      order: sequelize.literal('distance ASC')
    });

    res.json(professionals);
  } catch (error) {
    console.error('Erro ao buscar profissionais próximos:', error);
    res.status(500).json({ error: 'Erro ao buscar profissionais próximos' });
  }
});

// Rota para atualizar localização do cliente
router.put('/client/location', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.type !== 'client') {
      return res.status(403).json({ error: 'Apenas clientes podem atualizar localização' });
    }

    const { latitude, longitude } = req.body;
    
    const client = await Client.findOne({ where: { userId: user.id } });
    if (!client) {
      return res.status(404).json({ error: 'Perfil de cliente não encontrado' });
    }

    await client.update({ latitude, longitude });

    res.json({ message: 'Localização atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar localização:', error);
    res.status(500).json({ error: 'Erro ao atualizar localização' });
  }
});

// Rota para calcular rota até o cliente
router.get('/route', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { clientId } = req.query;
    
    if (user.type !== 'professional') {
      return res.status(403).json({ error: 'Apenas profissionais podem acessar esta rota' });
    }

    const professional = await Professional.findOne({ where: { userId: user.id } });
    if (!professional) {
      return res.status(404).json({ error: 'Perfil de profissional não encontrado' });
    }

    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Aqui seria integrado com serviço de rotas como Google Maps
    // Por enquanto, retornamos apenas as coordenadas
    res.json({
      origin: {
        latitude: professional.latitude,
        longitude: professional.longitude
      },
      destination: {
        latitude: client.latitude,
        longitude: client.longitude
      },
      // Dados fictícios que seriam retornados por um serviço de rotas
      distance: {
        text: "5.2 km",
        value: 5200 // metros
      },
      duration: {
        text: "15 minutos",
        value: 900 // segundos
      }
    });
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    res.status(500).json({ error: 'Erro ao calcular rota' });
  }
});

module.exports = router;
