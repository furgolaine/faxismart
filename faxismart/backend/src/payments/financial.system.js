// Sistema de Precificação e Divisão Financeira do Faxismart
// Baseado na documentação fornecida

class FinancialSystem {
  constructor() {
    // Taxas da plataforma (em porcentagem)
    this.platformFeePercentage = 10; // 10% para a plataforma
    this.referralFeePercentage = 5;  // 5% para indicações
    
    // Preço base por metro quadrado (em reais)
    this.baseSquareMeterPrice = 1.5;
    
    // Multiplicadores de complexidade
    this.complexityMultipliers = {
      1: 1.0,  // Limpeza básica
      2: 1.1,  // Limpeza intermediária
      3: 1.2,  // Limpeza pesada
      4: 1.3,  // Limpeza pós-obra
      5: 1.4   // Limpeza especializada
    };
  }

  /**
   * Calcula o preço total do serviço
   * @param {number} squareMeters - Metragem do imóvel
   * @param {number} complexityLevel - Nível de complexidade (1-5)
   * @param {boolean} hasDiscount - Se possui desconto de primeira compra
   * @returns {number} - Preço total do serviço
   */
  calculateTotalPrice(squareMeters, complexityLevel, hasDiscount = false) {
    // Validação de entrada
    if (squareMeters <= 0) {
      throw new Error('A metragem deve ser maior que zero');
    }
    
    if (!this.complexityMultipliers[complexityLevel]) {
      throw new Error('Nível de complexidade inválido');
    }
    
    // Cálculo do preço base
    const basePrice = squareMeters * this.baseSquareMeterPrice;
    
    // Aplicação do multiplicador de complexidade
    const priceWithComplexity = basePrice * this.complexityMultipliers[complexityLevel];
    
    // Aplicação de desconto para primeira compra (10%)
    const finalPrice = hasDiscount ? priceWithComplexity * 0.9 : priceWithComplexity;
    
    // Arredonda para duas casas decimais
    return Math.round(finalPrice * 100) / 100;
  }

  /**
   * Calcula a divisão de valores entre plataforma, profissional e indicador
   * @param {number} totalPrice - Preço total do serviço
   * @param {boolean} hasReferral - Se possui indicação
   * @returns {Object} - Objeto com a divisão de valores
   */
  calculatePaymentDistribution(totalPrice, hasReferral = false) {
    // Validação de entrada
    if (totalPrice <= 0) {
      throw new Error('O preço total deve ser maior que zero');
    }
    
    // Cálculo da taxa da plataforma
    const platformFee = totalPrice * (this.platformFeePercentage / 100);
    
    // Cálculo da taxa de indicação (se aplicável)
    const referralFee = hasReferral ? totalPrice * (this.referralFeePercentage / 100) : 0;
    
    // Cálculo do valor para o profissional
    const professionalAmount = totalPrice - platformFee - referralFee;
    
    // Arredonda todos os valores para duas casas decimais
    return {
      totalPrice: Math.round(totalPrice * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
      referralFee: Math.round(referralFee * 100) / 100,
      professionalAmount: Math.round(professionalAmount * 100) / 100
    };
  }

  /**
   * Calcula o preço estimado com base na metragem e complexidade
   * @param {number} squareMeters - Metragem do imóvel
   * @param {number} complexityLevel - Nível de complexidade (1-5)
   * @param {boolean} hasReferral - Se possui indicação
   * @param {boolean} hasDiscount - Se possui desconto de primeira compra
   * @returns {Object} - Objeto com detalhes do preço e divisão de valores
   */
  calculateServicePrice(squareMeters, complexityLevel, hasReferral = false, hasDiscount = false) {
    // Calcula o preço total
    const totalPrice = this.calculateTotalPrice(squareMeters, complexityLevel, hasDiscount);
    
    // Calcula a distribuição de pagamento
    const distribution = this.calculatePaymentDistribution(totalPrice, hasReferral);
    
    // Retorna objeto completo com todas as informações
    return {
      pricing: {
        squareMeters,
        pricePerSquareMeter: this.baseSquareMeterPrice,
        complexityLevel,
        complexityMultiplier: this.complexityMultipliers[complexityLevel],
        basePrice: squareMeters * this.baseSquareMeterPrice,
        hasDiscount,
        discountAmount: hasDiscount ? (squareMeters * this.baseSquareMeterPrice * this.complexityMultipliers[complexityLevel] * 0.1) : 0,
        totalPrice
      },
      distribution: {
        platformFeePercentage: this.platformFeePercentage,
        platformFee: distribution.platformFee,
        hasReferral,
        referralFeePercentage: hasReferral ? this.referralFeePercentage : 0,
        referralFee: distribution.referralFee,
        professionalAmount: distribution.professionalAmount,
        professionalPercentage: 100 - this.platformFeePercentage - (hasReferral ? this.referralFeePercentage : 0)
      }
    };
  }
}

module.exports = FinancialSystem;
