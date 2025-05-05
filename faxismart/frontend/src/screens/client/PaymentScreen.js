import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const PaymentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { appointmentId } = route.params;
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [appointment, setAppointment] = useState(null);
  
  // Estados para o formulário de pagamento
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Simulação de dados do agendamento
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      const mockAppointment = {
        id: appointmentId,
        professional: {
          id: '1',
          name: 'Maria Silva',
        },
        date: '25/04/2025',
        time: '09:00',
        status: 'pending',
        squareMeters: 80,
        complexityLevel: 2,
        totalPrice: 120.00,
        paymentStatus: 'pending'
      };
      
      setAppointment(mockAppointment);
      setLoading(false);
    }, 1000);
  }, [appointmentId]);

  const formatCardNumber = (value) => {
    // Remove todos os espaços
    const cleaned = value.replace(/\s+/g, '');
    // Adiciona espaço a cada 4 caracteres
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted;
  };

  const formatCardExpiry = (value) => {
    // Remove todos os caracteres não numéricos
    const cleaned = value.replace(/[^\d]/g, '');
    // Formata como MM/YY
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = () => {
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 16) {
        Alert.alert('Erro', 'Número do cartão inválido');
        return false;
      }
      
      if (!cardName) {
        Alert.alert('Erro', 'Nome no cartão é obrigatório');
        return false;
      }
      
      if (!cardExpiry || cardExpiry.length < 5) {
        Alert.alert('Erro', 'Data de validade inválida');
        return false;
      }
      
      if (!cardCvv || cardCvv.length < 3) {
        Alert.alert('Erro', 'CVV inválido');
        return false;
      }
    }
    
    return true;
  };

  const handlePayment = () => {
    if (!validateForm()) return;
    
    setProcessingPayment(true);
    
    // Simulação de processamento de pagamento
    setTimeout(() => {
      setProcessingPayment(false);
      
      Alert.alert(
        'Pagamento Realizado',
        'Seu pagamento foi processado com sucesso!',
        [
          { 
            text: 'Ver Detalhes', 
            onPress: () => navigation.navigate('AppointmentDetails', { appointmentId }) 
          }
        ]
      );
    }, 2000);
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
        <Text style={styles.title}>Pagamento</Text>
        <Text style={styles.subtitle}>Agendamento #{appointmentId}</Text>
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Profissional:</Text>
          <Text style={styles.infoValue}>{appointment.professional.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data:</Text>
          <Text style={styles.infoValue}>{appointment.date} às {appointment.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Metragem:</Text>
          <Text style={styles.infoValue}>{appointment.squareMeters} m²</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Complexidade:</Text>
          <Text style={styles.infoValue}>Nível {appointment.complexityLevel}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Valor Total:</Text>
          <Text style={styles.totalValue}>R$ {appointment.totalPrice.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.paymentContainer}>
        <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Cartão de Crédito" value="credit_card" />
            <Picker.Item label="Cartão de Débito" value="debit_card" />
            <Picker.Item label="PIX" value="pix" />
          </Picker>
        </View>
        
        {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
          <View style={styles.cardFormContainer}>
            <TextInput
              style={styles.input}
              placeholder="Número do Cartão"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              maxLength={19} // 16 dígitos + 3 espaços
            />
            
            <TextInput
              style={styles.input}
              placeholder="Nome no Cartão"
              placeholderTextColor="#999"
              value={cardName}
              onChangeText={setCardName}
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Validade (MM/AA)"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={cardExpiry}
                onChangeText={(text) => setCardExpiry(formatCardExpiry(text))}
                maxLength={5} // MM/YY
              />
              
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="CVV"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={cardCvv}
                onChangeText={setCardCvv}
                maxLength={4}
              />
            </View>
          </View>
        )}
        
        {paymentMethod === 'pix' && (
          <View style={styles.pixContainer}>
            <Text style={styles.pixInstructions}>
              Ao confirmar, você receberá um QR Code para pagamento via PIX.
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.paymentButton}
        onPress={handlePayment}
        disabled={processingPayment}
      >
        {processingPayment ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.paymentButtonText}>
            {paymentMethod === 'pix' ? 'Gerar QR Code PIX' : 'Finalizar Pagamento'}
          </Text>
        )}
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
  headerContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  summaryContainer: {
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
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentContainer: {
    marginBottom: 30,
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
  cardFormContainer: {
    marginTop: 10,
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
  pixContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  pixInstructions: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  paymentButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
