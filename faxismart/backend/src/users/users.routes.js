const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const Professional = require('./professional.model');
const Client = require('./client.model');

// Middleware para verificar autenticação
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'faxismart_secret');
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, type, ...additionalData } = req.body;

    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password, // Será criptografado pelo hook beforeCreate
      phone,
      type,
      status: 'pending'
    });

    // Criar perfil específico baseado no tipo
    if (type === 'professional') {
      await Professional.create({
        userId: user.id,
        experience: additionalData.experience || 0,
        pricePerSquareMeter: additionalData.pricePerSquareMeter || 1.00,
        available: false,
        documentVerified: false,
        documentUrl: additionalData.documentUrl || null,
        latitude: additionalData.latitude || null,
        longitude: additionalData.longitude || null
      });
    } else if (type === 'client') {
      await Client.create({
        userId: user.id,
        address: additionalData.address || '',
        addressNumber: additionalData.addressNumber || '',
        complement: additionalData.complement || '',
        neighborhood: additionalData.neighborhood || '',
        city: additionalData.city || '',
        state: additionalData.state || '',
        zipCode: additionalData.zipCode || '',
        latitude: additionalData.latitude || null,
        longitude: additionalData.longitude || null,
        squareMeters: additionalData.squareMeters || null,
        paymentMethod: additionalData.paymentMethod || null,
        referredBy: additionalData.referralCode ? await findProfessionalByReferralCode(additionalData.referralCode) : null
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, type: user.type },
      process.env.JWT_SECRET || 'faxismart_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        status: user.status
      },
      token
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Função auxiliar para encontrar profissional por código de referência
const findProfessionalByReferralCode = async (code) => {
  const professional = await Professional.findOne({ where: { referralCode: code } });
  return professional ? professional.id : null;
};

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Verificar status do usuário
    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Sua conta está bloqueada. Entre em contato com o suporte.' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, type: user.type },
      process.env.JWT_SECRET || 'faxismart_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        status: user.status
      },
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Rota para obter perfil do usuário
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    let profileData = {};

    // Buscar dados específicos baseado no tipo de usuário
    if (user.type === 'professional') {
      const professional = await Professional.findOne({ where: { userId: user.id } });
      profileData = professional ? professional.toJSON() : {};
    } else if (user.type === 'client') {
      const client = await Client.findOne({ where: { userId: user.id } });
      profileData = client ? client.toJSON() : {};
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        status: user.status,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      },
      profile: profileData
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

// Rota para atualizar perfil do usuário
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { name, phone, password, ...profileData } = req.body;

    // Atualizar dados básicos do usuário
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (password) updateData.password = password;

    if (Object.keys(updateData).length > 0) {
      await user.update(updateData);
    }

    // Atualizar dados específicos baseado no tipo de usuário
    if (user.type === 'professional' && Object.keys(profileData).length > 0) {
      const professional = await Professional.findOne({ where: { userId: user.id } });
      if (professional) {
        await professional.update(profileData);
      }
    } else if (user.type === 'client' && Object.keys(profileData).length > 0) {
      const client = await Client.findOne({ where: { userId: user.id } });
      if (client) {
        await client.update(profileData);
      }
    }

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// Rota para buscar detalhes de um profissional específico
router.get('/professionals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const professional = await Professional.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone', 'profileImage', 'createdAt']
        }
      ]
    });

    if (!professional) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    res.json(professional);
  } catch (error) {
    console.error('Erro ao buscar detalhes do profissional:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do profissional' });
  }
});

// Rota para atualizar disponibilidade do profissional
router.put('/professionals/availability', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.type !== 'professional') {
      return res.status(403).json({ error: 'Apenas profissionais podem atualizar disponibilidade' });
    }

    const { available } = req.body;
    
    const professional = await Professional.findOne({ where: { userId: user.id } });
    if (!professional) {
      return res.status(404).json({ error: 'Perfil de profissional não encontrado' });
    }

    await professional.update({ available });

    res.json({ message: 'Disponibilidade atualizada com sucesso', available });
  } catch (error) {
    console.error('Erro ao atualizar disponibilidade:', error);
    res.status(500).json({ error: 'Erro ao atualizar disponibilidade' });
  }
});

// Rota para atualizar localização do profissional
router.put('/professionals/location', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.type !== 'professional') {
      return res.status(403).json({ error: 'Apenas profissionais podem atualizar localização' });
    }

    const { latitude, longitude } = req.body;
    
    const professional = await Professional.findOne({ where: { userId: user.id } });
    if (!professional) {
      return res.status(404).json({ error: 'Perfil de profissional não encontrado' });
    }

    await professional.update({ latitude, longitude });

    res.json({ message: 'Localização atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar localização:', error);
    res.status(500).json({ error: 'Erro ao atualizar localização' });
  }
});

module.exports = router;
