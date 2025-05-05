import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const AppointmentDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { appointmentId } = route.params;
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Simulação de dados do agendamento
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockAppointment = {
        id: appointmentId,
        client: {
          id: '101',
          name: 'Roberto Almeida',
          phone: '(11) 98765-4321',
          rating: 4.7,
          totalRatings: 15
        },
        date: '25/04/2025',
        time: '09:00',
        address: 'Rua das Flores, 123',
        addressNumber: '123',
        complement: 'Apto 45',
        neighborhood: 'Jardim Primavera',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        latitude: -23.5505,
        longitude: -46.6333,
        squareMeters: 80,
        complexityLevel: 2,
        notes: 'Favor trazer produtos para limpeza de vidros e espelhos.',
        totalPrice: 120.00,
        status: 'confirmed',
        paymentStatus: 'completed'
      };
      
      setAppointment(mockAppointment);
      setLoading(false);
    }, 1000);
  }, [appointmentId]);

  const handleStartService = () => {
    setProcessingAction(true);
    
    // Simulação de chamada à API
    setTimeout(() => {
      setAppointment({
        ...appointment,
        status: 'in_progress'
      });
      
      setProcessingAction(false);
    }, 1500);
  };

  const handleCompleteService = () => {
    setProcessingAction(true);
    
    // Simulação de chamada à API
    setTimeout(() => {
      setAppointment({
        ...appointment,
        status: 'completed'
      });
      
      setProcessingAction(false);
      
      Alert.alert(
        'Serviço Concluído',
        'O serviço foi marcado como concluído com sucesso!',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const handleViewRoute = () => {
    navigation.navigate('RouteMap', {
      clientId: appointment.client.id,
      destination: {
        latitude: appointment.latitude,
        longitude: appointment.longitude,
        address: `${appointment.address}, ${appointment.addressNumber} - ${appointment.neighborhood}, ${appointment.city}`
      }
    });
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
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: appointment.latitude,
            longitude: appointment.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: appointment.latitude,
              longitude: appointment.longitude,
            }}
            title={appointment.client.name}
            description={appointment.address}
          />
        </MapView>
        
        <TouchableOpacity 
          style={styles.routeButton}
          onPress={handleViewRoute}
        >
          <Text style={styles.routeButtonText}>Ver Rota</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Detalhes do Agendamento</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
            <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
          </View>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Data e Hora:</Text>
          <Text style={styles.dateValue}>{appointment.date} às {appointment.time}</Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValue}>{appointment.client.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Telefone:</Text>
            <Text style={styles.infoValue}>{appointment.client.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Avaliação:</Text>
            <Text style={styles.infoValue}>
              {appointment.client.rating} ({appointment.client.totalRatings} avaliações)
            </Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Text style={styles.addressText}>
            {appointment.address}, {appointment.addressNumber}
            {appointment.complement ? `, ${appointment.complement}` : ''}
          </Text>
          <Text style={styles.addressText}>
            {appointment.neighborhood}, {appointment.city}/{appointment.state}
          </Text>
          <Text style={styles.addressText}>
            CEP: {appointment.zipCode}
          </Text>
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
        
        <View style={styles.paymentContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.paymentLabel}>Valor do Serviço:</Text>
            <Text style={styles.paymentValue}>R$ {appointment.totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.paymentLabel}>Status do Pagamento:</Text>
            <Text style={[
              styles.paymentStatus, 
              { color: appointment.paymentStatus === 'completed' ? '#4CAF50' : '#FFC107' }
            ]}>
              {appointment.paymentStatus === 'completed' ? 'Pago' : 'Pendente'}
            </Text>
          </View>
        </View>
        
        {appointment.status === 'confirmed' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleStartService}
            disabled={processingAction}
          >
            {processingAction ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.actionButtonText}>Iniciar Serviço</Text>
            )}
          </TouchableOpacity>
        )}
        
        {appointment.status === 'in_progress' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCompleteService}
            disabled={processingAction}
          >
            {processingAction ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.actionButtonText}>Concluir Serviço</Text>
            )}
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
  mapContainer: {
    height: 200,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  routeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  routeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  contentContainer: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
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
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    color: '#757575',
    marginRight: 5,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
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
  paymentContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#757575',
    width: 150,
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppointmentDetailsScreen;
