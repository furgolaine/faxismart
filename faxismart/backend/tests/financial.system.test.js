// Testes unitários para o sistema financeiro do Faxismart
const FinancialSystem = require('../src/payments/financial.system');

// Inicializa o sistema financeiro
const financialSystem = new FinancialSystem();

describe('Sistema Financeiro', () => {
  describe('Cálculo de Preço', () => {
    test('Deve calcular corretamente o preço para limpeza básica', () => {
      const price = financialSystem.calculateTotalPrice(100, 1);
      expect(price).toBe(150); // 100m² * R$1,50 * 1.0 = R$150
    });

    test('Deve calcular corretamente o preço para limpeza intermediária', () => {
      const price = financialSystem.calculateTotalPrice(100, 2);
      expect(price).toBe(165); // 100m² * R$1,50 * 1.1 = R$165
    });

    test('Deve calcular corretamente o preço para limpeza pesada', () => {
      const price = financialSystem.calculateTotalPrice(100, 3);
      expect(price).toBe(180); // 100m² * R$1,50 * 1.2 = R$180
    });

    test('Deve calcular corretamente o preço para limpeza pós-obra', () => {
      const price = financialSystem.calculateTotalPrice(100, 4);
      expect(price).toBe(195); // 100m² * R$1,50 * 1.3 = R$195
    });

    test('Deve calcular corretamente o preço para limpeza especializada', () => {
      const price = financialSystem.calculateTotalPrice(100, 5);
      expect(price).toBe(210); // 100m² * R$1,50 * 1.4 = R$210
    });

    test('Deve aplicar desconto de 10% para primeira compra', () => {
      const price = financialSystem.calculateTotalPrice(100, 1, true);
      expect(price).toBe(135); // 100m² * R$1,50 * 1.0 * 0.9 = R$135
    });

    test('Deve lançar erro para metragem inválida', () => {
      expect(() => {
        financialSystem.calculateTotalPrice(0, 1);
      }).toThrow('A metragem deve ser maior que zero');
    });

    test('Deve lançar erro para nível de complexidade inválido', () => {
      expect(() => {
        financialSystem.calculateTotalPrice(100, 6);
      }).toThrow('Nível de complexidade inválido');
    });
  });

  describe('Distribuição de Pagamento', () => {
    test('Deve calcular corretamente a distribuição sem referência', () => {
      const distribution = financialSystem.calculatePaymentDistribution(150);
      
      expect(distribution.totalPrice).toBe(150);
      expect(distribution.platformFee).toBe(15); // 10% de R$150 = R$15
      expect(distribution.referralFee).toBe(0); // Sem referência
      expect(distribution.professionalAmount).toBe(135); // R$150 - R$15 = R$135
    });

    test('Deve calcular corretamente a distribuição com referência', () => {
      const distribution = financialSystem.calculatePaymentDistribution(150, true);
      
      expect(distribution.totalPrice).toBe(150);
      expect(distribution.platformFee).toBe(15); // 10% de R$150 = R$15
      expect(distribution.referralFee).toBe(7.5); // 5% de R$150 = R$7,50
      expect(distribution.professionalAmount).toBe(127.5); // R$150 - R$15 - R$7,50 = R$127,50
    });

    test('Deve lançar erro para preço total inválido', () => {
      expect(() => {
        financialSystem.calculatePaymentDistribution(0);
      }).toThrow('O preço total deve ser maior que zero');
    });
  });

  describe('Cálculo de Serviço Completo', () => {
    test('Deve calcular corretamente o serviço sem referência e sem desconto', () => {
      const result = financialSystem.calculateServicePrice(100, 1, false, false);
      
      // Verificação do preço
      expect(result.pricing.squareMeters).toBe(100);
      expect(result.pricing.pricePerSquareMeter).toBe(1.5);
      expect(result.pricing.complexityLevel).toBe(1);
      expect(result.pricing.complexityMultiplier).toBe(1.0);
      expect(result.pricing.basePrice).toBe(150);
      expect(result.pricing.hasDiscount).toBe(false);
      expect(result.pricing.discountAmount).toBe(0);
      expect(result.pricing.totalPrice).toBe(150);
      
      // Verificação da distribuição
      expect(result.distribution.platformFeePercentage).toBe(10);
      expect(result.distribution.platformFee).toBe(15);
      expect(result.distribution.hasReferral).toBe(false);
      expect(result.distribution.referralFeePercentage).toBe(0);
      expect(result.distribution.referralFee).toBe(0);
      expect(result.distribution.professionalAmount).toBe(135);
      expect(result.distribution.professionalPercentage).toBe(90);
    });

    test('Deve calcular corretamente o serviço com referência e com desconto', () => {
      const result = financialSystem.calculateServicePrice(100, 1, true, true);
      
      // Verificação do preço
      expect(result.pricing.squareMeters).toBe(100);
      expect(result.pricing.pricePerSquareMeter).toBe(1.5);
      expect(result.pricing.complexityLevel).toBe(1);
      expect(result.pricing.complexityMultiplier).toBe(1.0);
      expect(result.pricing.basePrice).toBe(150);
      expect(result.pricing.hasDiscount).toBe(true);
      expect(result.pricing.discountAmount).toBe(15);
      expect(result.pricing.totalPrice).toBe(135);
      
      // Verificação da distribuição
      expect(result.distribution.platformFeePercentage).toBe(10);
      expect(result.distribution.platformFee).toBe(13.5);
      expect(result.distribution.hasReferral).toBe(true);
      expect(result.distribution.referralFeePercentage).toBe(5);
      expect(result.distribution.referralFee).toBe(6.75);
      expect(result.distribution.professionalAmount).toBe(114.75);
      expect(result.distribution.professionalPercentage).toBe(85);
    });
  });
});
