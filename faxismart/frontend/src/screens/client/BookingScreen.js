import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const BookingScreen = ({ route }) => {
  const navigation = useNavigation();
  const { professionalId } = route.params;
  const [loading, setLoading] = useState(false);
  
  // Estados para o formulário
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState('09:00');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [squareMeters, setSquareMeters] = useState('');
  const [complexityLevel, setComplexityLevel] = useState(1);
  const [notes, setNotes] = useState('');
  
  // Preço estimado (simulação)
  const pricePerSquareMeter = 1.5; // Valor do profissional selecionado
  const estimatedPrice = squareMeters ? 
    parseFloat(squareMeters) * pricePerSquareMeter * (1 + (complexityLevel - 1) * 0.1) : 
    0;

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(false);
    
    // Formatando a hora para string HH:MM
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    setTime(`${hours}:${minutes}`);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleBooking = () => {
    if (!squareMeters) {
      Alert.alert('Erro', 'Por favor, informe a metragem do imóvel');
      return;
    }

    setLoading(true);

    // Simulação de chamada à API
    setTimeout(() => {
      setLoading(false);
      
      Alert.alert(
        'Agendamento Realizado',
        'Seu agendamento foi realizado com sucesso! O profissional receberá sua solicitação.',
        [
          { 
            text: 'Ver Detalhes', 
            onPress: () => navigation.navigate('AppointmentDetails', { 
              appointmentId: '123',
              professionalId,
              date: formatDate(date),
              time,
              squareMeters,
              complexityLevel,
              notes,
              totalPrice: estimatedPrice
            }) 
          }
        ]
      );
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Agendar Serviço</Text>
        <Text style={styles.subtitle}>Preencha os detalhes para agendar</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Data e Hora</Text>
        
        <TouchableOpacity 
          style={styles.dateTimeInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateTimeText}>Data: {formatDate(date)}</Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
        
        <TouchableOpacity 
          style={styles.dateTimeInput}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateTimeText}>Hora: {time}</Text>
        </TouchableOpacity>
        
        {showTimePicker && (
          <DateTimePicker
            value={new Date(`2025-01-01T${time}:00`)}
            mode="time"
            display="default"
            onChange={onTimeChange}
            minuteInterval={30}
          />
        )}
        
        <Text style={styles.sectionTitle}>Detalhes do Imóvel</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Metragem do imóvel (m²) *"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={squareMeters}
          onChangeText={setSquareMeters}
        />
        
        <Text style={styles.label}>Nível de Complexidade:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={complexityLevel}
            onValueChange={(itemValue) => setComplexityLevel(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="1 - Limpeza Básica" value={1} />
            <Picker.Item label="2 - Limpeza Intermediária" value={2} />
            <Picker.Item label="3 - Limpeza Pesada" value={3} />
            <Picker.Item label="4 - Limpeza Pós-obra" value={4} />
            <Picker.Item label="5 - Limpeza Especializada" value={5} />
          </Picker>
        </View>
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Observações ou instruções especiais"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
        />
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Preço Estimado:</Text>
          <Text style={styles.priceValue}>
            R$ {estimatedPrice.toFixed(2)}
          </Text>
        </View>
        
        <Text style={styles.priceInfo}>
          O preço final pode variar de acordo com serviços adicionais solicitados durante a execução.
        </Text>
        
        <TouchableOpacity 
          style={styles.bookingButton}
          onPress={handleBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.bookingButtonText}>Confirmar Agendamento</Text>
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
  dateTimeInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
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
  priceInfo: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
    marginBottom: 20,
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

export default BookingScreen;
