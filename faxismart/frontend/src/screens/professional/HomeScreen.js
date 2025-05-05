import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const ProfessionalHomeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
  const [location, setLocation] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [pendingRequests, setPendingRequests] = useState([]);

  // Simulação de dados
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockRequests = [
        {
          id: '1',
          client: {
            id: '101',
            name: 'Roberto Almeida',
          },
          date: '25/04/2025',
          time: '09:00',
          address: 'Rua das Flores, 123, Jardim Primavera',
          squareMeters: 80,
          complexityLevel: 2,
          totalPrice: 120.00,
          distance: 2.5
        },
        {
          id: '2',
          client: {
            id: '102',
            name: 'Fernanda Costa',
          },
          date: '26/04/2025',
          time: '14:00',
          address: 'Av. Paulista, 1000, Bela Vista',
          squareMeters: 60,
          complexityLevel: 1,
          totalPrice: 90.00,
          distance: 3.8
        }
      ];
      
      setPendingRequests(mockRequests);
      setLoading(false);
    }, 1500);
  }, []);

  const handleAvailabilityToggle = (value) => {
    setAvailable(value);
    
    // Simulação de chamada à API para atualizar disponibilidade
    // Na implementação real, seria:
    // await professionalService.updateAvailability(value);
  };

  const handleRequestPress = (requestId) => {
    navigation.navigate('RequestDetails', { requestId });
  };

  const renderRequestItem = (request) => (
    <TouchableOpacity 
      key={request.id}
      style={styles.requestCard}
      onPress={() => handleRequestPress(request.id)}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.clientName}>{request.client.name}</Text>
        <Text style={styles.requestDistance}>{request.distance} km</Text>
      </View>
      
      <Text style={styles.requestAddress}>{request.address}</Text>
      
      <View style={styles.requestDetails}>
        <Text style={styles.requestDate}>{request.date} às {request.time}</Text>
        <Text style={styles.requestPrice}>R$ {request.totalPrice.toFixed(2)}</Text>
      </View>
      
      <View style={styles.requestFooter}>
        <Text style={styles.requestMeters}>{request.squareMeters} m² • Nível {request.complexityLevel}</Text>
        <Text style={styles.viewDetails}>Ver detalhes</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={location}
        >
          {/* Marcador da localização atual */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Sua localização"
            pinColor="#4CAF50"
          />
        </MapView>
        
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityText}>
            {available ? 'Disponível para serviços' : 'Indisponível para serviços'}
          </Text>
          <Switch
            trackColor={{ false: "#E0E0E0", true: "#A5D6A7" }}
            thumbColor={available ? "#4CAF50" : "#F5F5F5"}
            onValueChange={handleAvailabilityToggle}
            value={available}
          />
        </View>
      </View>
      
      <View style={styles.requestsContainer}>
        <Text style={styles.sectionTitle}>Solicitações Pendentes</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Carregando solicitações...</Text>
          </View>
        ) : pendingRequests.length > 0 ? (
          <View>
            {pendingRequests.map(renderRequestItem)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma solicitação pendente no momento.
              {!available && '\n\nAtive sua disponibilidade para receber solicitações.'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    height: '40%',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  availabilityContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  requestsContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
  },
  requestCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  requestDistance: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  requestAddress: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  requestDate: {
    fontSize: 14,
    color: '#333333',
  },
  requestPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  requestMeters: {
    fontSize: 12,
    color: '#757575',
  },
  viewDetails: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default ProfessionalHomeScreen;
