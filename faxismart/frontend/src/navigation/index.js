import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Telas de autenticação
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import RegisterClientScreen from './screens/auth/RegisterClientScreen';
import RegisterProfessionalScreen from './screens/auth/RegisterProfessionalScreen';

// Telas do cliente
import ClientHomeScreen from './screens/client/HomeScreen';
import ProfessionalDetailsScreen from './screens/client/ProfessionalDetailsScreen';
import BookingScreen from './screens/client/BookingScreen';
import AppointmentDetailsScreen from './screens/client/AppointmentDetailsScreen';
import ClientAppointmentsScreen from './screens/client/AppointmentsScreen';
import PaymentScreen from './screens/client/PaymentScreen';
import ClientProfileScreen from './screens/client/ProfileScreen';
import ClientEditProfileScreen from './screens/client/EditProfileScreen';

// Telas do profissional
import ProfessionalHomeScreen from './screens/professional/HomeScreen';
import RequestDetailsScreen from './screens/professional/RequestDetailsScreen';
import ProfessionalAppointmentsScreen from './screens/professional/AppointmentsScreen';
import ProfessionalAppointmentDetailsScreen from './screens/professional/AppointmentDetailsScreen';
import EarningsScreen from './screens/professional/EarningsScreen';
import ReferralsScreen from './screens/professional/ReferralsScreen';
import ProfessionalProfileScreen from './screens/professional/ProfileScreen';
import ProfessionalEditProfileScreen from './screens/professional/EditProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegação para clientes
const ClientTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={ClientHomeScreen} 
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={ClientAppointmentsScreen} 
        options={{ title: 'Agendamentos' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ClientProfileScreen} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

// Navegação para profissionais
const ProfessionalTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={ProfessionalHomeScreen} 
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={ProfessionalAppointmentsScreen} 
        options={{ title: 'Agendamentos' }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen} 
        options={{ title: 'Ganhos' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfessionalProfileScreen} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Telas de autenticação */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Cadastro' }}
        />
        <Stack.Screen 
          name="RegisterClient" 
          component={RegisterClientScreen} 
          options={{ title: 'Cadastro de Cliente' }}
        />
        <Stack.Screen 
          name="RegisterProfessional" 
          component={RegisterProfessionalScreen} 
          options={{ title: 'Cadastro de Profissional' }}
        />
        
        {/* Navegação principal para clientes */}
        <Stack.Screen 
          name="ClientTabs" 
          component={ClientTabNavigator} 
          options={{ headerShown: false }}
        />
        
        {/* Telas adicionais para clientes */}
        <Stack.Screen 
          name="ProfessionalDetails" 
          component={ProfessionalDetailsScreen} 
          options={{ title: 'Detalhes do Profissional' }}
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen} 
          options={{ title: 'Agendar Serviço' }}
        />
        <Stack.Screen 
          name="AppointmentDetails" 
          component={AppointmentDetailsScreen} 
          options={{ title: 'Detalhes do Agendamento' }}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen} 
          options={{ title: 'Pagamento' }}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={ClientEditProfileScreen} 
          options={{ title: 'Editar Perfil' }}
        />
        
        {/* Navegação principal para profissionais */}
        <Stack.Screen 
          name="ProfessionalTabs" 
          component={ProfessionalTabNavigator} 
          options={{ headerShown: false }}
        />
        
        {/* Telas adicionais para profissionais */}
        <Stack.Screen 
          name="RequestDetails" 
          component={RequestDetailsScreen} 
          options={{ title: 'Detalhes da Solicitação' }}
        />
        <Stack.Screen 
          name="ProfessionalAppointmentDetails" 
          component={ProfessionalAppointmentDetailsScreen} 
          options={{ title: 'Detalhes do Agendamento' }}
        />
        <Stack.Screen 
          name="Referrals" 
          component={ReferralsScreen} 
          options={{ title: 'Programa de Indicação' }}
        />
        <Stack.Screen 
          name="ProfessionalEditProfile" 
          component={ProfessionalEditProfileScreen} 
          options={{ title: 'Editar Perfil' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
