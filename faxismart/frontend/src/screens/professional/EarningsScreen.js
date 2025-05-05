import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EarningsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(null);
  const [activeTab, setActiveTab] = useState('week');

  // Simulação de dados de ganhos
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockEarnings = {
        week: {
          total: 450.00,
          platformFee: 45.00,
          netEarnings: 405.00,
          completedServices: 3,
          pendingPayments: 1,
          pendingAmount: 120.00,
          history: [
            { date: '19/04/2025', amount: 150.00, client: 'Roberto Almeida' },
            { date: '17/04/2025', amount: 180.00, client: 'Fernanda Costa' },
            { date: '15/04/2025', amount: 120.00, client: 'Paulo Mendes' },
          ]
        },
        month: {
          total: 1850.00,
          platformFee: 185.00,
          netEarnings: 1665.00,
          completedServices: 12,
          pendingPayments: 2,
          pendingAmount: 270.00,
          history: [
            { date: '19/04/2025', amount: 150.00, client: 'Roberto Almeida' },
            { date: '17/04/2025', amount: 180.00, client: 'Fernanda Costa' },
            { date: '15/04/2025', amount: 120.00, client: 'Paulo Mendes' },
            { date: '12/04/2025', amount: 200.00, client: 'Mariana Santos' },
            { date: '10/04/2025', amount: 150.00, client: 'Carlos Oliveira' },
            { date: '08/04/2025', amount: 180.00, client: 'Ana Silva' },
            { date: '05/04/2025', amount: 120.00, client: 'João Pereira' },
            { date: '03/04/2025', amount: 200.00, client: 'Luciana Costa' },
            { date: '01/04/2025', amount: 150.00, client: 'Pedro Santos' },
            { date: '29/03/2025', amount: 180.00, client: 'Juliana Alves' },
            { date: '27/03/2025', amount: 120.00, client: 'Ricardo Mendes' },
            { date: '25/03/2025', amount: 100.00, client: 'Camila Ferreira' },
          ]
        },
        total: {
          total: 8750.00,
          platformFee: 875.00,
          netEarnings: 7875.00,
          completedServices: 58,
          pendingPayments: 3,
          pendingAmount: 390.00,
          referralBonus: 250.00
        }
      };
      
      setEarnings(mockEarnings);
      setLoading(false);
    }, 1500);
  }, []);

  const getCurrentEarnings = () => {
    if (!earnings) return null;
    return earnings[activeTab];
  };

  const renderHistoryItem = (item, index) => (
    <View key={index} style={styles.historyItem}>
      <View style={styles.historyItemLeft}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={styles.historyClient}>{item.client}</Text>
      </View>
      <Text style={styles.historyAmount}>R$ {item.amount.toFixed(2)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando dados financeiros...</Text>
      </View>
    );
  }

  const currentEarnings = getCurrentEarnings();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'week' && styles.activeTab]}
          onPress={() => setActiveTab('week')}
        >
          <Text style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}>
            Semana
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'month' && styles.activeTab]}
          onPress={() => setActiveTab('month')}
        >
          <Text style={[styles.tabText, activeTab === 'month' && styles.activeTabText]}>
            Mês
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'total' && styles.activeTab]}
          onPress={() => setActiveTab('total')}
        >
          <Text style={[styles.tabText, activeTab === 'total' && styles.activeTabText]}>
            Total
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.earningsContainer}>
        <Text style={styles.earningsLabel}>
          {activeTab === 'week' ? 'Ganhos da Semana' : 
           activeTab === 'month' ? 'Ganhos do Mês' : 'Ganhos Totais'}
        </Text>
        <Text style={styles.earningsValue}>
          R$ {currentEarnings.netEarnings.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentEarnings.completedServices}</Text>
          <Text style={styles.statLabel}>Serviços</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>R$ {currentEarnings.total.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Valor Bruto</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>R$ {currentEarnings.platformFee.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Taxa</Text>
        </View>
      </View>
      
      {activeTab === 'total' && (
        <View style={styles.bonusContainer}>
          <Text style={styles.bonusLabel}>Bônus de Indicação</Text>
          <Text style={styles.bonusValue}>R$ {currentEarnings.referralBonus.toFixed(2)}</Text>
        </View>
      )}
      
      {currentEarnings.pendingPayments > 0 && (
        <View style={styles.pendingContainer}>
          <Text style={styles.pendingLabel}>
            {currentEarnings.pendingPayments} pagamento{currentEarnings.pendingPayments > 1 ? 's' : ''} pendente{currentEarnings.pendingPayments > 1 ? 's' : ''}
          </Text>
          <Text style={styles.pendingValue}>R$ {currentEarnings.pendingAmount.toFixed(2)}</Text>
        </View>
      )}
      
      {activeTab !== 'total' && currentEarnings.history && (
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          {currentEarnings.history.map(renderHistoryItem)}
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.referralButton}
        onPress={() => navigation.navigate('Referrals')}
      >
        <Text style={styles.referralButtonText}>Ver Programa de Indicação</Text>
      </TouchableOpacity>
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
  earningsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  earningsLabel: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 5,
  },
  earningsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  bonusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  bonusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  bonusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pendingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  pendingLabel: {
    fontSize: 14,
    color: '#FFA000',
  },
  pendingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA000',
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
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  historyItemLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 3,
  },
  historyClient: {
    fontSize: 12,
    color: '#757575',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  referralButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  referralButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EarningsScreen;
