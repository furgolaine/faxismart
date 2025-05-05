import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const RequestDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { requestId } = route.params;
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Simulação de dados da solicitação
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockRequest = {
        id: requestId,
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
        distance: 2.5,
        status: 'pending'
      };
      
      setRequest(mockRequest);
      setLoading(false);
    }, 1000);
  }, [requestId]);

  const handleAccept = () => {
    setProcessingAction(true);
    
    // Simulação de chamada à API
    setTimeout(() => {
      setRequest({
        ...request,
        status: 'confirmed'
      });
      
      setProcessingAction(false);
      
      navigation.navigate('Appointments');
    }, 1500);
  };

  const handleReject = () => {
    setProcessingAction(true);
    
    // Simulação de chamada à API
    setTimeout(() => {
      setProcessingAction(false);
      navigation.goBack();
    }, 1500);
  };

  const handleViewRoute = () => {
    navigation.navigate('RouteMap', {
      clientId: request.client.id,
      destination: {
        latitude: request.latitude,
        longitude: request.longitude,
        address: `${request.address}, ${request.addressNumber} - ${request.neighborhood}, ${request.city}`
      }
    });
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
            latitude: request.latitude,
            longitude: request.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: request.latitude,
              longitude: request.longitude,
            }}
            title={request.client.name}
            description={request.address}
          />
        </MapView>
        
        <TouchableOpacity 
          style={styles.routeButton}
          onPress={handleViewRoute}
        >
          <Text style={styles.routeButtonText}>Ver Rota • {request.distance} km</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Solicitação de Serviço</Text>
          <Text style={styles.date}>{request.date} às {request.time}</Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValue}>{request.client.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Telefone:</Text>
            <Text style={styles.infoValue}>{request.client.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Avaliação:</Text>
            <Text style={styles.infoValue}>
              {request.client.rating} ({request.client.totalRatings} avaliações)
            </Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Text style={styles.addressText}>
            {request.address}, {request.addressNumber}
            {request.complement ? `, ${request.complement}` : ''}
          </Text>
          <Text style={styles.addressText}>
            {request.neighborhood}, {request.city}/{request.state}
          </Text>
          <Text style={styles.addressText}>
            CEP: {request.zipCode}
          </Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Detalhes do Serviço</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Metragem:</Text>
            <Text style={styles.infoValue}>{request.squareMeters} m²</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Complexidade:</Text>
            <Text style={styles.infoValue}>Nível {request.complexityLevel}</Text>
          </View>
          {request.notes ? (
            <View style={styles.notesContainer}>
              <Text style={styles.infoLabel}>Observações:</Text>
              <Text style={styles.notesText}>{request.notes}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Valor do Serviço:</Text>
          <Text style={styles.priceValue}>R$ {request.totalPrice.toFixed(2)}</Text>
        </View>
        
        {request.status === 'pending' && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.acceptButton}
              onPress={handleAccept}
              disabled={processingAction}
            >
              {processingAction ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.acceptButtonText}>Aceitar Serviço</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.rejectButton}
              onPress={handleReject}
              disabled={processingAction}
            >
              <Text style={styles.rejectButtonText}>Recusar</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
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
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
    marginVertical: 20,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionsContainer: {
    marginBottom: 30,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RequestDetailsScreen;
