// Reducer para gerenciamento de usuários
const initialState = {
  profile: null,
  loading: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_PROFILE_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PROFILE_SUCCESS':
      return {
        ...state,
        profile: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_PROFILE_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_PROFILE_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        profile: action.payload,
        loading: false,
        error: null
      };
    case 'UPDATE_PROFILE_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;
