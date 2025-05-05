import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Share, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ReferralsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');

  // Simulação de dados de referências
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockReferralData = {
        referralCode: 'FXMA1234',
        totalReferrals: 8,
        activeReferrals: 5,
        usedReferrals: 3,
        totalEarnings: 250.00,
        referrals: [
          { 
            id: '1', 
            clientName: 'Roberto Almeida', 
            date: '15/03/2025', 
            status: 'active',
            bonusAmount: 0
          },
          { 
            id: '2', 
            clientName: 'Fernanda Costa', 
            date: '20/03/2025', 
            status: 'used',
            bonusAmount: 75.00
          },
          { 
            id: '3', 
            clientName: 'Paulo Mendes', 
            date: '25/03/2025', 
            status: 'used',
            bonusAmount: 90.00
          },
          { 
            id: '4', 
            clientName: 'Mariana Santos', 
            date: '01/04/2025', 
            status: 'active',
            bonusAmount: 0
          },
          { 
            id: '5', 
            clientName: 'Carlos Oliveira', 
            date: '05/04/2025', 
            status: 'used',
            bonusAmount: 85.00
          },
          { 
            id: '6', 
            clientName: 'Ana Silva', 
            date: '10/04/2025', 
            status: 'active',
            bonusAmount: 0
          },
          { 
            id: '7', 
            clientName: 'João Pereira', 
            date: '15/04/2025', 
            status: 'active',
            bonusAmount: 0
          },
          { 
            id: '8', 
            clientName: 'Luciana Costa', 
            date: '18/04/2025', 
            status: 'active',
            bonusAmount: 0
          },
        ]
      };
      
      setReferralData(mockReferralData);
      setLoading(false);
    }, 1500);
  }, []);

  const handleShareCode = async () => {
    try {
      const result = await Share.share({
        message: `Use meu código de indicação ${referralData.referralCode} no aplicativo Faxismart e ganhe 10% de desconto no seu primeiro serviço!`,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o código');
    }
  };

  const renderReferralItem = (item, index) => (
    <View key={index} style={styles.referralItem}>
      <View style={styles.referralItemLeft}>
        <Text style={styles.referralName}>{item.clientName}</Text>
        <Text style={styles.referralDate}>{item.date}</Text>
      </View>
      <View style={styles.referralItemRight}>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.status === 'used' ? '#4CAF50' : '#FFC107' }
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'used' ? 'Utilizado' : 'Ativo'}
          </Text>
        </View>
        {item.status === 'used' && (
          <Text style={styles.bonusAmount}>+R$ {item.bonusAmount.toFixed(2)}</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando dados de indicações...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Programa de Indicação</Text>
        <Text style={styles.subtitle}>Indique amigos e ganhe 5% do valor dos serviços</Text>
      </View>
      
      <View style={styles.codeContainer}>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Seu código de indicação</Text>
          <Text style={styles.codeValue}>{referralData.referralCode}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShareCode}
        >
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            Estatísticas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'stats' ? (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{referralData.totalReferrals}</Text>
              <Text style={styles.statLabel}>Total de Indicações</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{referralData.activeReferrals}</Text>
              <Text style={styles.statLabel}>Indicações Ativas</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{referralData.usedReferrals}</Text>
              <Text style={styles.statLabel}>Indicações Utilizadas</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statValue}>R$ {referralData.totalEarnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Ganhos Totais</Text>
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Como funciona?</Text>
            <Text style={styles.infoText}>
              1. Compartilhe seu código de indicação com amigos e conhecidos.
            </Text>
            <Text style={styles.infoText}>
              2. Quando alguém se cadastrar usando seu código, você será vinculado como indicador.
            </Text>
            <Text style={styles.infoText}>
              3. A cada serviço que seu indicado contratar, você receberá 5% do valor como bônus.
            </Text>
            <Text style={styles.infoText}>
              4. Seu indicado também ganha 10% de desconto no primeiro serviço!
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Histórico de Indicações</Text>
          {referralData.referrals.map(renderReferralItem)}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#757575',
    fontSize: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  codeContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  codeBox: {
    alignItems: 'center',
    marginBottom: 15,
  },
  codeLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 2,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#757575',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  historyContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  referralItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  referralItemLeft: {
    flex: 1,
  },
  referralName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 3,
  },
  referralDate: {
    fontSize: 12,
    color: '#757575',
  },
  referralItemRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 5,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  bonusAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default ReferralsScreen;
