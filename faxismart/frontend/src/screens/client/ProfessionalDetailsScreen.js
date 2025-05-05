import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfessionalDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { professionalId } = route.params;
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState(null);
  const [ratings, setRatings] = useState([]);

  // Simulação de dados do profissional
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockProfessional = {
        id: professionalId,
        name: 'Maria Silva',
        rating: 4.8,
        totalRatings: 124,
        pricePerSquareMeter: 1.5,
        experience: 5,
        available: true,
        profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        description: 'Profissional com 5 anos de experiência em limpeza residencial. Especializada em limpeza pós-obra e limpeza pesada.'
      };
      
      const mockRatings = [
        {
          id: '1',
          clientName: 'Roberto Almeida',
          rating: 5,
          comment: 'Excelente profissional! Muito atenciosa e cuidadosa com os detalhes.',
          date: '15/04/2025'
        },
        {
          id: '2',
          clientName: 'Fernanda Costa',
          rating: 4,
          comment: 'Ótimo trabalho, recomendo!',
          date: '10/04/2025'
        },
        {
          id: '3',
          clientName: 'Paulo Mendes',
          rating: 5,
          comment: 'Muito pontual e eficiente. Fez um trabalho impecável.',
          date: '05/04/2025'
        },
      ];
      
      setProfessional(mockProfessional);
      setRatings(mockRatings);
      setLoading(false);
    }, 1000);
  }, [professionalId]);

  const handleBooking = () => {
    navigation.navigate('Booking', { professionalId });
  };

  const renderRatingItem = ({ item }) => (
    <View style={styles.ratingItem}>
      <View style={styles.ratingHeader}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <Text style={styles.ratingDate}>{item.date}</Text>
      </View>
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map(star => (
          <Text 
            key={star} 
            style={[styles.star, star <= item.rating ? styles.starFilled : styles.starEmpty]}
          >
            ★
          </Text>
        ))}
      </View>
      <Text style={styles.ratingComment}>{item.comment}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: professional.profileImage }} 
          style={styles.profileImage} 
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{professional.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{professional.rating}</Text>
            <Text style={styles.ratingCount}>({professional.totalRatings} avaliações)</Text>
          </View>
          <Text style={styles.experienceText}>{professional.experience} anos de experiência</Text>
          <Text style={styles.priceText}>R$ {professional.pricePerSquareMeter.toFixed(2)}/m²</Text>
        </View>
      </View>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.descriptionText}>{professional.description}</Text>
      </View>
      
      <View style={styles.ratingsContainer}>
        <Text style={styles.sectionTitle}>Avaliações</Text>
        <FlatList
          data={ratings}
          renderItem={renderRatingItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ratingsList}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.bookingButton}
        onPress={handleBooking}
      >
        <Text style={styles.bookingButtonText}>Agendar Serviço</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 22,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFC107',
    marginRight: 5,
  },
  ratingCount: {
    fontSize: 14,
    color: '#757575',
  },
  experienceText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  ratingsContainer: {
    flex: 1,
  },
  ratingsList: {
    paddingBottom: 20,
  },
  ratingItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  ratingDate: {
    fontSize: 12,
    color: '#757575',
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  starFilled: {
    color: '#FFC107',
  },
  starEmpty: {
    color: '#E0E0E0',
  },
  ratingComment: {
    fontSize: 14,
    color: '#757575',
  },
  bookingButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfessionalDetailsScreen;
