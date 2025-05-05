// Componente para exibir detalhes de preço e divisão financeira
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Componente que exibe os detalhes de preço e divisão financeira de um serviço
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.priceDetails - Detalhes do preço calculado
 * @param {boolean} props.showDistribution - Se deve mostrar a distribuição de valores
 * @param {boolean} props.isCompact - Se deve usar layout compacto
 */
const PriceDetailsComponent = ({ priceDetails, showDistribution = true, isCompact = false }) => {
  if (!priceDetails) return null;

  const { pricing, distribution } = priceDetails;

  const formatCurrency = (value) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalhes do Preço</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Metragem:</Text>
          <Text style={styles.value}>{pricing.squareMeters} m²</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Preço por m²:</Text>
          <Text style={styles.value}>{formatCurrency(pricing.pricePerSquareMeter)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Nível de complexidade:</Text>
          <Text style={styles.value}>{pricing.complexityLevel}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Multiplicador:</Text>
          <Text style={styles.value}>x{pricing.complexityMultiplier.toFixed(1)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Preço base:</Text>
          <Text style={styles.value}>{formatCurrency(pricing.basePrice)}</Text>
        </View>
        
        {pricing.hasDiscount && (
          <View style={styles.row}>
            <Text style={styles.label}>Desconto (10%):</Text>
            <Text style={styles.discountValue}>-{formatCurrency(pricing.discountAmount)}</Text>
          </View>
        )}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Preço Total:</Text>
          <Text style={styles.totalValue}>{formatCurrency(pricing.totalPrice)}</Text>
        </View>
      </View>
      
      {showDistribution && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribuição de Valores</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Taxa da plataforma ({distribution.platformFeePercentage}%):</Text>
            <Text style={styles.value}>{formatCurrency(distribution.platformFee)}</Text>
          </View>
          
          {distribution.hasReferral && (
            <View style={styles.row}>
              <Text style={styles.label}>Taxa de indicação ({distribution.referralFeePercentage}%):</Text>
              <Text style={styles.value}>{formatCurrency(distribution.referralFee)}</Text>
            </View>
          )}
          
          <View style={styles.row}>
            <Text style={styles.label}>Valor para o profissional ({distribution.professionalPercentage}%):</Text>
            <Text style={styles.professionalValue}>{formatCurrency(distribution.professionalAmount)}</Text>
          </View>
        </View>
      )}
      
      {!isCompact && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            * O preço é calculado com base na metragem do imóvel e no nível de complexidade do serviço.
          </Text>
          {pricing.hasDiscount && (
            <Text style={styles.infoText}>
              * Desconto de 10% aplicado para primeira compra.
            </Text>
          )}
          {distribution.hasReferral && (
            <Text style={styles.infoText}>
              * 5% do valor é destinado ao usuário que fez a indicação.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    flex: 3,
  },
  value: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  discountValue: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  professionalValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  infoContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  infoText: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
    marginBottom: 5,
  },
});

export default PriceDetailsComponent;
