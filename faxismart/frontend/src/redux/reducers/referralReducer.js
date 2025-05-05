// Reducer para gerenciamento de referências
const initialState = {
  referrals: [],
  referralCode: null,
  referralStats: null,
  loading: false,
  error: null
};

const referralReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_REFERRALS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_REFERRALS_SUCCESS':
      return {
        ...state,
        referrals: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_REFERRALS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'GENERATE_REFERRAL_CODE_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GENERATE_REFERRAL_CODE_SUCCESS':
      return {
        ...state,
        referralCode: action.payload,
        loading: false,
        error: null
      };
    case 'GENERATE_REFERRAL_CODE_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'FETCH_REFERRAL_STATS_SUCCESS':
      return {
        ...state,
        referralStats: action.payload,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

export default referralReducer;
