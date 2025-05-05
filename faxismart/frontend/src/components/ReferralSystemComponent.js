// Componente para exibir e gerenciar o sistema de referências
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import financialService from '../services/financialService';

/**
 * Componente que gerencia o sistema de referências e indicações
 * @param {Object} props - Propriedades do componente
 * @param {string} props.userId - ID do usuário atual
 * @param {string} props.userType - Tipo de usuário ('client' ou 'professional')
 * @param {Function} props.onReferralApplied - Callback quando um código de referência é aplicado
 */
const ReferralSystemComponent = ({ userId, userType, onReferralApplied }) => {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [userReferralCode, setUserReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState(null);

  // Carrega o código de referência do usuário e estatísticas
  useEffect(() => {
    if (userId) {
      loadReferralData();
    }
  }, [userId]);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      
      // Simulação de chamada à API para obter dados de referência
      // Na implementação real, isso seria uma chamada à API
      setTimeout(() => {
        // Dados simulados
        const mockReferralData = {
          code: `FX${userId.substring(0, 4).toUpperCase()}`,
          totalReferrals: userType === 'professional' ? 8 : 2,
          activeReferrals: userType === 'professional' ? 5 : 1,
          totalEarnings: userType === 'professional' ? 250.00 : 0,
          discountApplied: userType === 'client' ? 45.00 : 0
        };
        
        setUserReferralCode(mockReferralData.code);
        setReferralStats(mockReferralData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao carregar dados de referência:', error);
      setLoading(false);
    }
  };

  const handleApplyReferralCode = async () => {
    if (!referralCode.trim()) {
      Alert.alert('Erro', 'Por favor, insira um código de referência válido');
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulação de chamada à API para aplicar código de referência
      // Na implementação real, isso seria uma chamada à API
      setTimeout(() => {
        // Simulação de sucesso na maioria dos casos
        if (Math.random() > 0.2) {
          Alert.alert(
            'Sucesso',
            'Código de referência aplicado com sucesso! Você receberá 10% de desconto no seu próximo serviço.'
          );
          
          if (onReferralApplied) {
            onReferralApplied(referralCode);
          }
        } else {
          Alert.alert('Erro', 'Código de referência inválido ou expirado');
        }
        
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Erro ao aplicar código de referência:', error);
      Alert.alert('Erro', 'Não foi possível aplicar o código de referência');
      setLoading(false);
    }
  };

  const handleShareReferralCode = async () => {
    try {
      // Na implementação real, isso usaria a API de compartilhamento do dispositivo
      Alert.alert(
        'Compartilhar Código',
        `Seu código de referência ${userReferralCode} foi copiado para a área de transferência. Compartilhe com seus amigos!`
      );
    } catch (error) {
      console.error('Erro ao compartilhar código:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o código');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistema de Indicação</Text>
      
      {loading ? (
        <ActivityIndicator size="small" color="#4CAF50" style={styles.loader} />
      ) : (
        <>
          {userType === 'client' ? (
            // Interface para clientes
            <View>
              <Text style={styles.description}>
                Indique amigos e ganhe 10% de desconto no seu próximo serviço quando eles realizarem a primeira limpeza!
              </Text>
              
              {userReferralCode ? (
                <View style={styles.codeContainer}>
                  <Text style={styles.codeLabel}>Seu código de indicação:</Text>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeValue}>{userReferralCode}</Text>
                    <TouchableOpacity 
                      style={styles.shareButton}
                      onPress={handleShareReferralCode}
                    >
                      <Text style={styles.shareButtonText}>Compartilhar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Tem um código de indicação?</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Insira o código aqui"
                    value={referralCode}
                    onChangeText={setReferralCode}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity 
                    style={styles.applyButton}
                    onPress={handleApplyReferralCode}
                    disabled={loading}
                  >
                    <Text style={styles.applyButtonText}>Aplicar Código</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {referralStats && (
                <View style={styles.statsContainer}>
                  <Text style={styles.statsTitle}>Suas Indicações</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{referralStats.totalReferrals}</Text>
                      <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>R$ {referralStats.discountApplied.toFixed(2)}</Text>
                      <Text style={styles.statLabel}>Descontos</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ) : (
            // Interface para profissionais
            <View>
              <Text style={styles.description}>
                Indique amigos para se tornarem profissionais e ganhe 5% do valor de cada serviço que eles realizarem!
              </Text>
              
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Seu código de indicação:</Text>
                <View style={styles.codeBox}>
                  <Text style={styles.codeValue}>{userReferralCode}</Text>
                  <TouchableOpacity 
                    style={styles.shareButton}
                    onPress={handleShareReferralCode}
                  >
                    <Text style={styles.shareButtonText}>Compartilhar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {referralStats && (
                <View style={styles.statsContainer}>
                  <Text style={styles.statsTitle}>Suas Indicações</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{referralStats.totalReferrals}</Text>
                      <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{referralStats.activeReferrals}</Text>
                      <Text style={styles.statLabel}>Ativos</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>R$ {referralStats.totalEarnings.toFixed(2)}</Text>
                      <Text style={styles.statLabel}>Ganhos</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        </>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 15,
  },
  loader: {
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  codeContainer: {
    marginBottom: 15,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  codeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
  },
  codeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 1,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 10,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
});

export default ReferralSystemComponent;
