import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

const RegisterClientScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  // Dados pessoais
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Dados de endereço
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Dados adicionais
  const [squareMeters, setSquareMeters] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const validateForm = () => {
    if (!name || !email || !phone || !password || !confirmPassword || 
        !address || !addressNumber || !neighborhood || !city || !state || !zipCode) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Simulação de chamada à API
      // Na implementação real, seria:
      // const response = await authService.register({
      //   name, email, phone, password, type: 'client',
      //   address, addressNumber, complement, neighborhood, city, state, zipCode,
      //   squareMeters: parseInt(squareMeters) || 0,
      //   referralCode
      // });
      
      // Simulando resposta
      setTimeout(() => {
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { 
            user: { 
              id: '123', 
              name, 
              email, 
              type: 'client' 
            }, 
            token: 'token_simulado' 
          } 
        });
        
        Alert.alert(
          'Sucesso', 
          'Cadastro realizado com sucesso!',
          [{ text: 'OK', onPress: () => navigation.replace('ClientTabs') }]
        );
        
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', error.message || 'Falha ao realizar cadastro');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Cadastro de Cliente</Text>
        <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nome completo *"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email *"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Telefone *"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Senha *"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha *"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        
        <Text style={styles.sectionTitle}>Endereço</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Endereço *"
          placeholderTextColor="#999"
          value={address}
          onChangeText={setAddress}
        />
        
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Número *"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={addressNumber}
            onChangeText={setAddressNumber}
          />
          
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Complemento"
            placeholderTextColor="#999"
            value={complement}
            onChangeText={setComplement}
          />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Bairro *"
          placeholderTextColor="#999"
          value={neighborhood}
          onChangeText={setNeighborhood}
        />
        
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Cidade *"
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
          />
          
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Estado *"
            placeholderTextColor="#999"
            maxLength={2}
            autoCapitalize="characters"
            value={state}
            onChangeText={setState}
          />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="CEP *"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={zipCode}
          onChangeText={setZipCode}
        />
        
        <Text style={styles.sectionTitle}>Informações Adicionais</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Metragem do imóvel (m²)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={squareMeters}
          onChangeText={setSquareMeters}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Código de indicação (se tiver)"
          placeholderTextColor="#999"
          value={referralCode}
          onChangeText={setReferralCode}
        />
        
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          )}
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
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  formContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterClientScreen;
