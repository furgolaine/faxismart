import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Simulação de dados do perfil
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockProfile = {
        id: '123',
        name: 'Maria Silva',
        email: 'maria.silva@email.com',
        phone: '(11) 98765-4321',
        profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        address: 'Rua das Flores, 123',
        addressNumber: '123',
        complement: 'Apto 45',
        neighborhood: 'Jardim Primavera',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        cpf: '123.456.789-00',
        bankInfo: {
          bank: 'Banco do Brasil',
          agency: '1234',
          account: '12345-6',
          accountType: 'Corrente'
        },
        rating: 4.8,
        totalRatings: 124,
        totalServices: 145,
        completedServices: 142,
        referralCode: 'FXMA1234',
        available: true
      };
      
      setProfile(mockProfile);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { profile });
  };

  const handleLogout = () => {
    // Simulação de logout
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileInitials}>
            {profile.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <Text style={styles.profileName}>{profile.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{profile.rating}</Text>
          <Text style={styles.ratingCount}>({profile.totalRatings} avaliações)</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.totalServices}</Text>
          <Text style={styles.statLabel}>Serviços</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.completedServices}</Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{profile.email}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Telefone</Text>
          <Text style={styles.infoValue}>{profile.phone}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>CPF</Text>
          <Text style={styles.infoValue}>{profile.cpf}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Endereço</Text>
          <Text style={styles.infoValue}>
            {profile.address}, {profile.addressNumber}
            {profile.complement ? `, ${profile.complement}` : ''}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Bairro</Text>
          <Text style={styles.infoValue}>{profile.neighborhood}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Cidade/Estado</Text>
          <Text style={styles.infoValue}>{profile.city}/{profile.state}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>CEP</Text>
          <Text style={styles.infoValue}>{profile.zipCode}</Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Informações Bancárias</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Banco</Text>
          <Text style={styles.infoValue}>{profile.bankInfo.bank}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Agência</Text>
          <Text style={styles.infoValue}>{profile.bankInfo.agency}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Conta</Text>
          <Text style={styles.infoValue}>{profile.bankInfo.account}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tipo de Conta</Text>
          <Text style={styles.infoValue}>{profile.bankInfo.accountType}</Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Código de Indicação</Text>
        
        <View style={styles.referralCodeContainer}>
          <Text style={styles.referralCodeValue}>{profile.referralCode}</Text>
          <TouchableOpacity 
            style={styles.referralButton}
            onPress={() => navigation.navigate('Referrals')}
          >
            <Text style={styles.referralButtonText}>Ver Indicações</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={handleEditProfile}
      >
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Sair</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
  },
  referralCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
  },
  referralCodeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 1,
  },
  referralButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  referralButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
