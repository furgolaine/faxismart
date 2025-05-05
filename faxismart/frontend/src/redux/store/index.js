// Configuração da store Redux
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Importação dos reducers
import authReducer from '../reducers/authReducer';
import userReducer from '../reducers/userReducer';
import appointmentReducer from '../reducers/appointmentReducer';
import professionalReducer from '../reducers/professionalReducer';
import paymentReducer from '../reducers/paymentReducer';
import referralReducer from '../reducers/referralReducer';
import notificationReducer from '../reducers/notificationReducer';

// Combinando todos os reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  appointments: appointmentReducer,
  professionals: professionalReducer,
  payments: paymentReducer,
  referrals: referralReducer,
  notifications: notificationReducer
});

// Criando a store com middleware thunk para ações assíncronas
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
