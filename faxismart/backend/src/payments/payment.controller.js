// Controlador para o sistema financeiro do Faxismart
const FinancialSystem = require('./financial.system');
const Payment = require('./payment.model');

class PaymentController {
  constructor() {
    this.financialSystem = new FinancialSystem();
  }

  /**
   * Calcula o preço estimado para um serviço
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  calculatePrice(req, res) {
    try {
      const { squareMeters, complexityLevel, hasReferral, hasDiscount } = req.body;
      
      // Validação dos dados de entrada
      if (!squareMeters || !complexityLevel) {
        return res.status(400).json({ 
          success: false, 
          message: 'Metragem e nível de complexidade são obrigatórios' 
        });
      }
      
      // Calcula o preço do serviço
      const priceDetails = this.financialSystem.calculateServicePrice(
        parseFloat(squareMeters),
        parseInt(complexityLevel),
        hasReferral || false,
        hasDiscount || false
      );
      
      return res.status(200).json({
        success: true,
        data: priceDetails
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Processa um pagamento para um serviço
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  async processPayment(req, res) {
    try {
      const { 
        appointmentId, 
        clientId, 
        professionalId, 
        referralId,
        squareMeters, 
        complexityLevel, 
        paymentMethod,
        cardDetails
      } = req.body;
      
      // Validação dos dados de entrada
      if (!appointmentId || !clientId || !professionalId || !squareMeters || !complexityLevel || !paymentMethod) {
        return res.status(400).json({ 
          success: false, 
          message: 'Dados incompletos para processamento do pagamento' 
        });
      }
      
      // Verifica se é a primeira compra do cliente (para aplicar desconto)
      // Na implementação real, isso seria verificado no banco de dados
      const isFirstPurchase = await this.isFirstPurchase(clientId);
      
      // Calcula o preço e a distribuição
      const priceDetails = this.financialSystem.calculateServicePrice(
        parseFloat(squareMeters),
        parseInt(complexityLevel),
        referralId ? true : false,
        isFirstPurchase
      );
      
      // Simulação de processamento de pagamento com gateway externo
      // Na implementação real, isso seria integrado com um gateway de pagamento
      const paymentResult = await this.processPaymentWithGateway(
        priceDetails.pricing.totalPrice,
        paymentMethod,
        cardDetails
      );
      
      if (!paymentResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Falha no processamento do pagamento',
          error: paymentResult.error
        });
      }
      
      // Cria o registro de pagamento no banco de dados
      const payment = await Payment.create({
        appointmentId,
        clientId,
        professionalId,
        referralId: referralId || null,
        amount: priceDetails.pricing.totalPrice,
        platformFee: priceDetails.distribution.platformFee,
        referralFee: priceDetails.distribution.referralFee,
        professionalAmount: priceDetails.distribution.professionalAmount,
        paymentMethod,
        transactionId: paymentResult.transactionId,
        status: 'completed',
        details: priceDetails
      });
      
      return res.status(200).json({
        success: true,
        message: 'Pagamento processado com sucesso',
        data: {
          paymentId: payment._id,
          transactionId: paymentResult.transactionId,
          amount: priceDetails.pricing.totalPrice,
          status: 'completed',
          details: priceDetails
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao processar pagamento',
        error: error.message
      });
    }
  }

  /**
   * Verifica se é a primeira compra do cliente
   * @param {string} clientId - ID do cliente
   * @returns {Promise<boolean>} - Se é a primeira compra
   */
  async isFirstPurchase(clientId) {
    // Na implementação real, isso verificaria no banco de dados
    // Simulação para fins de demonstração
    return Promise.resolve(Math.random() > 0.7); // 30% de chance de ser primeira compra
  }

  /**
   * Processa pagamento com gateway externo
   * @param {number} amount - Valor a ser cobrado
   * @param {string} method - Método de pagamento
   * @param {Object} cardDetails - Detalhes do cartão (se aplicável)
   * @returns {Promise<Object>} - Resultado do processamento
   */
  async processPaymentWithGateway(amount, method, cardDetails) {
    // Simulação de integração com gateway de pagamento
    // Na implementação real, isso seria integrado com um gateway como Stripe, PayPal, etc.
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulação de sucesso na maioria dos casos
        if (Math.random() > 0.1) {
          resolve({
            success: true,
            transactionId: 'txn_' + Math.random().toString(36).substring(2, 15),
            message: 'Pagamento aprovado'
          });
        } else {
          resolve({
            success: false,
            error: 'Pagamento recusado pela operadora'
          });
        }
      }, 1000);
    });
  }

  /**
   * Obtém o histórico de pagamentos de um cliente
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  async getClientPayments(req, res) {
    try {
      const { clientId } = req.params;
      
      if (!clientId) {
        return res.status(400).json({
          success: false,
          message: 'ID do cliente é obrigatório'
        });
      }
      
      const payments = await Payment.find({ clientId }).sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar histórico de pagamentos',
        error: error.message
      });
    }
  }

  /**
   * Obtém o histórico de ganhos de um profissional
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  async getProfessionalEarnings(req, res) {
    try {
      const { professionalId } = req.params;
      const { period } = req.query; // 'week', 'month', 'year', 'all'
      
      if (!professionalId) {
        return res.status(400).json({
          success: false,
          message: 'ID do profissional é obrigatório'
        });
      }
      
      // Define a data de início com base no período
      let startDate = new Date();
      if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (period === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      } else {
        startDate = new Date(0); // Desde o início
      }
      
      // Busca pagamentos do profissional no período
      const payments = await Payment.find({
        professionalId,
        createdAt: { $gte: startDate },
        status: 'completed'
      }).sort({ createdAt: -1 });
      
      // Calcula totais
      const totalEarnings = payments.reduce((sum, payment) => sum + payment.professionalAmount, 0);
      const totalServices = payments.length;
      
      // Calcula ganhos com referências (quando o profissional é o indicador)
      const referralPayments = await Payment.find({
        referralId: professionalId,
        createdAt: { $gte: startDate },
        status: 'completed'
      });
      
      const referralEarnings = referralPayments.reduce((sum, payment) => sum + payment.referralFee, 0);
      
      return res.status(200).json({
        success: true,
        data: {
          period,
          totalServices,
          totalEarnings,
          referralEarnings,
          totalAmount: totalEarnings + referralEarnings,
          payments
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar histórico de ganhos',
        error: error.message
      });
    }
  }
}

module.exports = new PaymentController();
