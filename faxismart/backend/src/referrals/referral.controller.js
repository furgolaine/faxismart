// Controlador para o sistema de referências do Faxismart
const Referral = require('./referral.model');
const User = require('../users/user.model');

class ReferralController {
  /**
   * Gera um código de referência para um usuário
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  async generateReferralCode(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        });
      }
      
      // Verifica se o usuário já possui um código de referência
      let referral = await Referral.findOne({ userId });
      
      if (referral) {
        return res.status(200).json({
          success: true,
          message: 'Código de referência já existe',
          data: {
            referralCode: referral.code,
            userId: referral.userId
          }
        });
      }
      
      // Gera um novo código de referência
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
      // Formato do código: FX + primeiras 4 letras do nome + 4 números aleatórios
      const namePrefix = user.name.substring(0, 4).toUpperCase();
      const randomNumbers = Math.floor(1000 + Math.random() * 9000);
      const code = `FX${namePrefix}${randomNumbers}`;
      
      // Cria o registro de referência
      referral = await Referral.create({
        userId,
        code,
        userType: user.role,
        active: true
      });
      
      return res.status(201).json({
        success: true,
        message: 'Código de referência gerado com sucesso',
        data: {
          referralCode: referral.code,
          userId: referral.userId
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao gerar código de referência',
        error: error.message
      });
    }
  }

  /**
   * Aplica um código de referência para um usuário
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  async applyReferralCode(req, res) {
    try {
      const { userId } = req.params;
      const { referralCode } = req.body;
      
      if (!userId || !referralCode) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário e código de referência são obrigatórios'
        });
      }
      
      // Verifica se o código de referência existe
      const referral = await Referral.findOne({ code: referralCode });
      
      if (!referral) {
        return res.status(404).json({
          success: false,
          message: 'Código de referência inválido'
        });
      }
      
      // Verifica se o usuário está tentando usar o próprio código
      if (referral.userId.toString() === userId) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível usar seu próprio código de referência'
        });
      }
      
      // Verifica se o usuário já aplicou algum código de referência
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
      if (user.referralApplied) {
        return res.status(400).json({
          success: false,
          message: 'Usuário já aplicou um código de referência'
        });
      }
      
      // Atualiza o usuário com o código de referência aplicado
      await User.findByIdAndUpdate(userId, {
        referralApplied: referralCode,
        referralUserId: referral.userId
      });
      
      // Adiciona o usuário à lista de referidos
      await Referral.findByIdAndUpdate(referral._id, {
        $push: {
          referredUsers: {
            userId,
            date: new Date(),
            status: 'active'
          }
        }
      });
      
      return res.status(200).json({
        success: true,
        message: 'Código de referência aplicado com sucesso',
        data: {
          referralCode,
          referralUserId: referral.userId,
          discountApplied: true
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao aplicar código de referência',
        error: error.message
      });
    }
  }

  /**
   * Obtém estatísticas de referência de um usuário
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  async getReferralStats(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        });
      }
      
      // Busca o registro de referência do usuário
      const referral = await Referral.findOne({ userId });
      
      if (!referral) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não possui código de referência'
        });
      }
      
      // Calcula estatísticas
      const totalReferrals = referral.referredUsers.length;
      const activeReferrals = referral.referredUsers.filter(user => user.status === 'active').length;
      
      // Busca ganhos com referências (quando o usuário é o indicador)
      const user = await User.findById(userId);
      let totalEarnings = 0;
      let discountApplied = 0;
      
      if (user.role === 'professional') {
        // Para profissionais, calcula os ganhos com referências
        // Na implementação real, isso seria calculado a partir dos pagamentos
        totalEarnings = totalReferrals * 50; // Valor médio simulado
      } else {
        // Para clientes, calcula os descontos aplicados
        // Na implementação real, isso seria calculado a partir dos pagamentos
        discountApplied = user.referralApplied ? 45 : 0; // Valor simulado
      }
      
      return res.status(200).json({
        success: true,
        data: {
          referralCode: referral.code,
          totalReferrals,
          activeReferrals,
          totalEarnings,
          discountApplied,
          referredUsers: referral.referredUsers
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao obter estatísticas de referência',
        error: error.message
      });
    }
  }

  /**
   * Lista todos os usuários referidos por um usuário
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  async getReferredUsers(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        });
      }
      
      // Busca o registro de referência do usuário
      const referral = await Referral.findOne({ userId });
      
      if (!referral) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não possui código de referência'
        });
      }
      
      // Busca detalhes dos usuários referidos
      const referredUserIds = referral.referredUsers.map(user => user.userId);
      const referredUsers = await User.find({ _id: { $in: referredUserIds } }, 'name email role');
      
      // Combina os dados de referência com os dados dos usuários
      const detailedReferredUsers = referral.referredUsers.map(refUser => {
        const userDetails = referredUsers.find(u => u._id.toString() === refUser.userId.toString());
        return {
          ...refUser.toObject(),
          name: userDetails ? userDetails.name : 'Usuário desconhecido',
          email: userDetails ? userDetails.email : '',
          role: userDetails ? userDetails.role : ''
        };
      });
      
      return res.status(200).json({
        success: true,
        count: detailedReferredUsers.length,
        data: detailedReferredUsers
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar usuários referidos',
        error: error.message
      });
    }
  }
}

module.exports = new ReferralController();
