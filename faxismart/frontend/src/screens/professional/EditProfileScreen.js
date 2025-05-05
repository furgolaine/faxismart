import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const EditProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { profile } = route.params;
  const [loading, setLoading] = useState(false);
  
  // Estados para o formulário
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [addressNumber, setAddressNumber] = useState(profile.addressNumber);
  const [complement, setComplement] = useState(profile.complement);
  const [neighborhood, setNeighborhood] = useState(profile.neighborhood);
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [zipCode, setZipCode] = useState(profile.zipCode);
  
  // Informações bancárias
  const [bank, setBank] = useState(profile.bankInfo.bank);
  const [agency, setAgency] = useState(profile.bankInfo.agency);
  const [account, setAccount] = useState(profile.bankInfo.account);
  const [accountType, setAccountType] = useState(profile.bankInfo.accountType);

  const handleSave = () => {
    if (!name || !phone || !address || !addressNumber || !neighborhood || !city || !state || !zipCode) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (!bank || !agency || !account || !accountType) {
      Alert.alert('Erro', 'Por favor, preencha todas as informações bancárias');
      return;
    }
    
    setLoading(true);
    
    // Simulação de chamada à API
    setTimeout(() => {
      setLoading(false);
      
      Alert.alert(
        'Sucesso',
        'Perfil atualizado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Editar Perfil</Text>
        <Text style={styles.subtitle}>Atualize suas informações</Text>
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
          placeholder="Telefone *"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
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
        
        <Text style={styles.sectionTitle}>Informações Bancárias</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Banco *"
          placeholderTextColor="#999"
          value={bank}
          onChangeText={setBank}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Agência *"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={agency}
          onChangeText={setAgency}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Conta *"
          placeholderTextColor="#999"
          value={account}
          onChangeText={setAccount}
        />
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={accountType}
            onValueChange={(itemValue) => setAccountType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Conta Corrente" value="Corrente" />
            <Picker.Item label="Conta Poupança" value="Poupança" />
          </Picker>
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
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
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
