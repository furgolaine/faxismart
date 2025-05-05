// Reducer para gerenciamento de pagamentos
const initialState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_PAYMENTS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PAYMENTS_SUCCESS':
      return {
        ...state,
        payments: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_PAYMENTS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'PROCESS_PAYMENT_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'PROCESS_PAYMENT_SUCCESS':
      return {
        ...state,
        currentPayment: action.payload,
        payments: [...state.payments, action.payload],
        loading: false,
        error: null
      };
    case 'PROCESS_PAYMENT_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default paymentReducer;
