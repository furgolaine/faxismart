// Serviço para integração com o sistema de referências
import axios from 'axios';
import { API_URL } from '../config';

/**
 * Serviço para gerenciar operações do sistema de referências
 */
class ReferralService {
  /**
   * Gera um código de referência para um usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} - Dados do código de referência
   */
  async generateReferralCode(userId) {
    try {
      const response = await axios.post(`${API_URL}/referrals/generate/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao gerar código de referência:', error);
      throw error;
    }
  }

  /**
   * Aplica um código de referência para um usuário
   * @param {string} userId - ID do usuário
   * @param {string} referralCode - Código de referência a ser aplicado
   * @returns {Promise<Object>} - Resultado da aplicação
   */
  async applyReferralCode(userId, referralCode) {
    try {
      const response = await axios.post(`${API_URL}/referrals/apply/${userId}`, {
        referralCode
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao aplicar código de referência:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de referência de um usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} - Estatísticas de referência
   */
  async getReferralStats(userId) {
    try {
      const response = await axios.get(`${API_URL}/referrals/stats/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de referência:', error);
      throw error;
    }
  }

  /**
   * Lista todos os usuários referidos por um usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<Array>} - Lista de usuários referidos
   */
  async getReferredUsers(userId) {
    try {
      const response = await axios.get(`${API_URL}/referrals/users/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao listar usuários referidos:', error);
      throw error;
    }
  }

  /**
   * Verifica se um usuário tem direito a desconto de primeira compra
   * @param {string} userId - ID do usuário
   * @returns {Promise<boolean>} - Se tem direito a desconto
   */
  async checkFirstPurchaseDiscount(userId) {
    try {
      // Na implementação real, isso seria uma chamada à API
      // Simulação para fins de demonstração
      return Promise.resolve(Math.random() > 0.7); // 30% de chance de ter desconto
    } catch (error) {
      console.error('Erro ao verificar desconto de primeira compra:', error);
      return false;
    }
  }

  /**
   * Formata um código de referência para exibição
   * @param {string} code - Código de referência
   * @returns {string} - Código formatado
   */
  formatReferralCode(code) {
    if (!code) return '';
    return code.toUpperCase();
  }
}

export default new ReferralService();
