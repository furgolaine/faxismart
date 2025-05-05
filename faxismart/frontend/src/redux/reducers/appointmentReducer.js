// Reducer para gerenciamento de agendamentos
const initialState = {
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_APPOINTMENTS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_APPOINTMENTS_SUCCESS':
      return {
        ...state,
        appointments: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_APPOINTMENTS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'FETCH_APPOINTMENT_DETAIL_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_APPOINTMENT_DETAIL_SUCCESS':
      return {
        ...state,
        currentAppointment: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_APPOINTMENT_DETAIL_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'CREATE_APPOINTMENT_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'CREATE_APPOINTMENT_SUCCESS':
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
        currentAppointment: action.payload,
        loading: false,
        error: null
      };
    case 'CREATE_APPOINTMENT_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_APPOINTMENT_STATUS_SUCCESS':
      return {
        ...state,
        appointments: state.appointments.map(appointment => 
          appointment.id === action.payload.id ? action.payload : appointment
        ),
        currentAppointment: state.currentAppointment && state.currentAppointment.id === action.payload.id 
          ? action.payload 
          : state.currentAppointment
      };
    default:
      return state;
  }
};

export default appointmentReducer;
