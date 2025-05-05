import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const ClientHomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [nearbyProfessionals, setNearbyProfessionals] = useState([]);

  // Simulação de dados de profissionais próximos
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockProfessionals = [
        {
          id: '1',
          name: 'Maria Silva',
          rating: 4.8,
          totalRatings: 124,
          pricePerSquareMeter: 1.5,
          distance: 1.2,
          available: true,
          profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
          id: '2',
          name: 'João Santos',
          rating: 4.5,
          totalRatings: 89,
          pricePerSquareMeter: 1.2,
          distance: 2.5,
          available: true,
          profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          id: '3',
          name: 'Ana Oliveira',
          rating: 4.9,
          totalRatings: 156,
          pricePerSquareMeter: 1.8,
          distance: 3.1,
          available: true,
          profileImage: 'https://randomuser.me/api/portraits/women/68.jpg'
        },
        {
          id: '4',
          name: 'Carlos Pereira',
          rating: 4.6,
          totalRatings: 72,
          pricePerSquareMeter: 1.4,
          distance: 3.8,
          available: true,
          profileImage: 'https://randomuser.me/api/portraits/men/46.jpg'
        },
      ];
      
      setNearbyProfessionals(mockProfessionals);
      setLoading(false);
    }, 1500);
  }, []);

  const renderProfessionalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.professionalCard}
      onPress={() => navigation.navigate('ProfessionalDetails', { professionalId: item.id })}
    >
      <Image 
        source={{ uri: item.profileImage }} 
        style={styles.profileImage} 
      />
      <View style={styles.professionalInfo}>
        <Text style={styles.professionalName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.ratingCount}>({item.totalRatings})</Text>
        </View>
        <Text style={styles.priceText}>R$ {item.pricePerSquareMeter.toFixed(2)}/m²</Text>
      </View>
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>{item.distance} km</Text>
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
          
          {/* Marcadores dos profissionais próximos */}
          {nearbyProfessionals.map(professional => (
            <Marker
              key={professional.id}
              coordinate={{
                latitude: location.latitude + (Math.random() - 0.5) * 0.01,
                longitude: location.longitude + (Math.random() - 0.5) * 0.01,
              }}
              title={professional.name}
              description={`R$ ${professional.pricePerSquareMeter.toFixed(2)}/m²`}
            />
          ))}
        </MapView>
      </View>
      
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Profissionais Próximos</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Buscando profissionais próximos...</Text>
          </View>
        ) : (
          <FlatList
            data={nearbyProfessionals}
            renderItem={renderProfessionalItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
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
  listContainer: {
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
  listContent: {
    paddingBottom: 20,
  },
  professionalCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFC107',
    marginRight: 5,
  },
  ratingCount: {
    fontSize: 12,
    color: '#757575',
  },
  priceText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  distanceContainer: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  distanceText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default ClientHomeScreen;
