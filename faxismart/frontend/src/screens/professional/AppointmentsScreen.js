import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);

  // Simulação de dados de agendamentos
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockAppointments = [
        {
          id: '1',
          client: {
            id: '101',
            name: 'Roberto Almeida',
            address: 'Rua das Flores, 123, Jardim Primavera',
          },
          date: '25/04/2025',
          time: '09:00',
          status: 'confirmed',
          totalPrice: 120.00,
          paymentStatus: 'pending'
        },
        {
          id: '2',
          client: {
            id: '102',
            name: 'Fernanda Costa',
            address: 'Av. Paulista, 1000, Bela Vista',
          },
          date: '30/04/2025',
          time: '14:00',
          status: 'pending',
          totalPrice: 90.00,
          paymentStatus: 'completed'
        },
        {
          id: '3',
          client: {
            id: '103',
            name: 'Paulo Mendes',
            address: 'Rua Augusta, 500, Consolação',
          },
          date: '10/04/2025',
          time: '10:30',
          status: 'completed',
          totalPrice: 150.00,
          paymentStatus: 'completed'
        },
        {
          id: '4',
          client: {
            id: '104',
            name: 'Mariana Santos',
            address: 'Rua Oscar Freire, 200, Jardins',
          },
          date: '05/04/2025',
          time: '16:00',
          status: 'cancelled',
          totalPrice: 80.00,
          paymentStatus: 'pending'
        },
      ];
      
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1500);
  }, []);

  const getFilteredAppointments = () => {
    if (activeTab === 'upcoming') {
      return appointments.filter(appointment => 
        ['pending', 'confirmed'].includes(appointment.status)
      );
    } else if (activeTab === 'completed') {
      return appointments.filter(appointment => 
        appointment.status === 'completed'
      );
    } else {
      return appointments.filter(appointment => 
        appointment.status === 'cancelled'
      );
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'in_progress': return 'Em andamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFC107';
      case 'confirmed': return '#2196F3';
      case 'in_progress': return '#9C27B0';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#757575';
    }
  };

  const renderAppointmentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.appointmentCard}
      onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: item.id })}
    >
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentDate}>{item.date} às {item.time}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.appointmentBody}>
        <Text style={styles.clientName}>{item.client.name}</Text>
        <Text style={styles.appointmentPrice}>R$ {item.totalPrice.toFixed(2)}</Text>
      </View>
      
      <Text style={styles.addressText}>{item.client.address}</Text>
      
      <View style={styles.appointmentFooter}>
        <Text style={[
          styles.paymentStatus, 
          { color: item.paymentStatus === 'completed' ? '#4CAF50' : '#FFC107' }
        ]}>
          {item.paymentStatus === 'completed' ? 'Pago' : 'Pagamento Pendente'}
        </Text>
        <Text style={styles.viewDetails}>Ver detalhes</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Próximos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Concluídos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
            Cancelados
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Carregando agendamentos...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredAppointments()}
          renderItem={renderAppointmentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhum agendamento {activeTab === 'upcoming' ? 'próximo' : 
                  activeTab === 'completed' ? 'concluído' : 'cancelado'}.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#757575',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
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
  listContent: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  appointmentBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  appointmentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  addressText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  paymentStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewDetails: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default AppointmentsScreen;
