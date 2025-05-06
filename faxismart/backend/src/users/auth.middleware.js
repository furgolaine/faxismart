// Middleware de autenticação para ser usado em todas as rotas protegidas
const jwt = require('jsonwebtoken');
const User = require('./user.model');

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

    // Verificar se o usuário está ativo
    if (user.status !== 'active') {
      return res.status(403).json({ 
        error: 'Conta inativa ou bloqueada',
        status: user.status
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
