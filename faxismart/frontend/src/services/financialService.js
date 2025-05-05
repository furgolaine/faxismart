// Serviço para integração com o sistema financeiro
import axios from 'axios';
import { API_URL } from '../config';

/**
 * Serviço para gerenciar operações financeiras no aplicativo
 */
class FinancialService {
  /**
   * Calcula o preço estimado para um serviço
   * @param {number} squareMeters - Metragem do imóvel
   * @param {number} complexityLevel - Nível de complexidade (1-5)
   * @param {boolean} hasReferral - Se possui indicação
   * @param {boolean} hasDiscount - Se possui desconto de primeira compra
   * @returns {Promise<Object>} - Detalhes do preço calculado
   */
  async calculatePrice(squareMeters, complexityLevel, hasReferral = false, hasDiscount = false) {
    try {
      const response = await axios.post(`${API_URL}/payments/calculate`, {
        squareMeters,
        complexityLevel,
        hasReferral,
        hasDiscount
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Erro ao calcular preço:', error);
      throw error;
    }
  }

  /**
   * Processa um pagamento para um serviço
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - Resultado do processamento
   */
  async processPayment(paymentData) {
    try {
      const response = await axios.post(`${API_URL}/payments/process`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  }

  /**
   * Obtém o histórico de pagamentos de um cliente
   * @param {string} clientId - ID do cliente
   * @returns {Promise<Array>} - Lista de pagamentos
   */
  async getClientPayments(clientId) {
    try {
      const response = await axios.get(`${API_URL}/payments/client/${clientId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar histórico de pagamentos:', error);
      throw error;
    }
  }

  /**
   * Obtém o histórico de ganhos de um profissional
   * @param {string} professionalId - ID do profissional
   * @param {string} period - Período ('week', 'month', 'year', 'all')
   * @returns {Promise<Object>} - Dados de ganhos
   */
  async getProfessionalEarnings(professionalId, period = 'month') {
    try {
      const response = await axios.get(
        `${API_URL}/payments/professional/${professionalId}?period=${period}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar histórico de ganhos:', error);
      throw error;
    }
  }

  /**
   * Formata um valor monetário para exibição
   * @param {number} value - Valor a ser formatado
   * @returns {string} - Valor formatado (ex: R$ 120,00)
   */
  formatCurrency(value) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Calcula o preço estimado localmente (para cálculos rápidos na interface)
   * @param {number} squareMeters - Metragem do imóvel
   * @param {number} complexityLevel - Nível de complexidade (1-5)
   * @returns {number} - Preço estimado
   */
  calculateEstimatedPrice(squareMeters, complexityLevel) {
    // Preço base por metro quadrado
    const basePrice = 1.5;
    
    // Multiplicadores de complexidade
    const complexityMultipliers = {
      1: 1.0,  // Limpeza básica
      2: 1.1,  // Limpeza intermediária
      3: 1.2,  // Limpeza pesada
      4: 1.3,  // Limpeza pós-obra
      5: 1.4   // Limpeza especializada
    };
    
    // Cálculo do preço
    const price = squareMeters * basePrice * complexityMultipliers[complexityLevel];
    
    // Arredonda para duas casas decimais
    return Math.round(price * 100) / 100;
  }
}

export default new FinancialService();
