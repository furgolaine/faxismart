import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [userType, setUserType] = useState(null);

  const handleSelectUserType = (type) => {
    setUserType(type);
    
    if (type === 'professional') {
      navigation.navigate('RegisterProfessional');
    } else {
      navigation.navigate('RegisterClient');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>Escolha como deseja se cadastrar</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[
            styles.optionCard, 
            userType === 'client' && styles.selectedCard
          ]}
          onPress={() => handleSelectUserType('client')}
        >
          <Image
            source={require('../../assets/images/client-icon.png')}
            style={styles.optionIcon}
            resizeMode="contain"
          />
          <Text style={styles.optionTitle}>Cliente</Text>
          <Text style={styles.optionDescription}>
            Encontre profissionais de limpeza qualificados perto de você
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.optionCard, 
            userType === 'professional' && styles.selectedCard
          ]}
          onPress={() => handleSelectUserType('professional')}
        >
          <Image
            source={require('../../assets/images/professional-icon.png')}
            style={styles.optionIcon}
            resizeMode="contain"
          />
          <Text style={styles.optionTitle}>Profissional</Text>
          <Text style={styles.optionDescription}>
            Ofereça seus serviços de limpeza e aumente sua renda
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Faça login</Text>
        </TouchableOpacity>
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
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  selectedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  optionIcon: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  optionDescription: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#757575',
    fontSize: 14,
    marginRight: 5,
  },
  loginButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
