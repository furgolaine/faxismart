import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import store from './redux/store';

// Telas de autenticação
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import RegisterProfessionalScreen from './screens/auth/RegisterProfessionalScreen';
import RegisterClientScreen from './screens/auth/RegisterClientScreen';

// Telas do cliente
import ClientHomeScreen from './screens/client/HomeScreen';
import ClientProfileScreen from './screens/client/ProfileScreen';
import ClientAppointmentsScreen from './screens/client/AppointmentsScreen';
import ClientSearchScreen from './screens/client/SearchScreen';
import ProfessionalDetailsScreen from './screens/client/ProfessionalDetailsScreen';
import BookingScreen from './screens/client/BookingScreen';
import PaymentScreen from './screens/client/PaymentScreen';
import RatingScreen from './screens/client/RatingScreen';

// Telas do profissional
import ProfessionalHomeScreen from './screens/professional/HomeScreen';
import ProfessionalProfileScreen from './screens/professional/ProfileScreen';
import ProfessionalAppointmentsScreen from './screens/professional/AppointmentsScreen';
import ProfessionalEarningsScreen from './screens/professional/EarningsScreen';
import ReferralScreen from './screens/professional/ReferralScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegação para clientes
const ClientTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={ClientHomeScreen} />
    <Tab.Screen name="Search" component={ClientSearchScreen} />
    <Tab.Screen name="Appointments" component={ClientAppointmentsScreen} />
    <Tab.Screen name="Profile" component={ClientProfileScreen} />
  </Tab.Navigator>
);

// Navegação para profissionais
const ProfessionalTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={ProfessionalHomeScreen} />
    <Tab.Screen name="Appointments" component={ProfessionalAppointmentsScreen} />
    <Tab.Screen name="Earnings" component={ProfessionalEarningsScreen} />
    <Tab.Screen name="Referrals" component={ReferralScreen} />
    <Tab.Screen name="Profile" component={ProfessionalProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          {/* Telas comuns */}
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
          <Stack.Screen name="RegisterProfessional" component={RegisterProfessionalScreen} options={{ title: 'Cadastro de Profissional' }} />
          <Stack.Screen name="RegisterClient" component={RegisterClientScreen} options={{ title: 'Cadastro de Cliente' }} />
          
          {/* Telas do cliente */}
          <Stack.Screen name="ClientTabs" component={ClientTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="ProfessionalDetails" component={ProfessionalDetailsScreen} options={{ title: 'Detalhes do Profissional' }} />
          <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Agendamento' }} />
          <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Pagamento' }} />
          <Stack.Screen name="Rating" component={RatingScreen} options={{ title: 'Avaliação' }} />
          
          {/* Telas do profissional */}
          <Stack.Screen name="ProfessionalTabs" component={ProfessionalTabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
