import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AppointmentDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { appointmentId } = route.params;
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);

  // Simulação de dados do agendamento
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockAppointment = {
        id: appointmentId,
        professional: {
          id: '1',
          name: 'Maria Silva',
          phone: '(11) 98765-4321',
          profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        date: '25/04/2025',
        time: '09:00',
        status: 'pending',
        squareMeters: 80,
        complexityLevel: 2,
        notes: 'Favor trazer produtos para limpeza de vidros e espelhos.',
        totalPrice: 120.00,
        paymentStatus: 'pending'
      };
      
      setAppointment(mockAppointment);
      setLoading(false);
    }, 1000);
  }, [appointmentId]);

  const handleCancelAppointment = () => {
    setLoading(true);
    
    // Simulação de chamada à API
    setTimeout(() => {
      setAppointment({
        ...appointment,
        status: 'cancelled'
      });
      
      setLoading(false);
    }, 1000);
  };

  const handlePayment = () => {
    navigation.navigate('Payment', { appointmentId });
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Detalhes do Agendamento</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Profissional</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{appointment.professional.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Telefone:</Text>
          <Text style={styles.infoValue}>{appointment.professional.phone}</Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Data e Hora</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data:</Text>
          <Text style={styles.infoValue}>{appointment.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hora:</Text>
          <Text style={styles.infoValue}>{appointment.time}</Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Detalhes do Serviço</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Metragem:</Text>
          <Text style={styles.infoValue}>{appointment.squareMeters} m²</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Complexidade:</Text>
          <Text style={styles.infoValue}>Nível {appointment.complexityLevel}</Text>
        </View>
        {appointment.notes ? (
          <View style={styles.notesContainer}>
            <Text style={styles.infoLabel}>Observações:</Text>
            <Text style={styles.notesText}>{appointment.notes}</Text>
          </View>
        ) : null}
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Pagamento</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Valor Total:</Text>
          <Text style={styles.priceValue}>R$ {appointment.totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={[
            styles.paymentStatus, 
            { color: appointment.paymentStatus === 'completed' ? '#4CAF50' : '#FFC107' }
          ]}>
            {appointment.paymentStatus === 'completed' ? 'Pago' : 'Pendente'}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        {appointment.status === 'pending' && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelAppointment}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar Agendamento</Text>
          </TouchableOpacity>
        )}
        
        {appointment.paymentStatus === 'pending' && appointment.status !== 'cancelled' && (
          <TouchableOpacity 
            style={styles.paymentButton}
            onPress={handlePayment}
          >
            <Text style={styles.paymentButtonText}>Realizar Pagamento</Text>
          </TouchableOpacity>
        )}
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  notesContainer: {
    marginTop: 10,
  },
  notesText: {
    fontSize: 14,
    color: '#333333',
    marginTop: 5,
    fontStyle: 'italic',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppointmentDetailsScreen;
