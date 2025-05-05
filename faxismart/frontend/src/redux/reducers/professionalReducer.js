// Reducer para gerenciamento de profissionais
const initialState = {
  professionals: [],
  nearbyProfessionals: [],
  currentProfessional: null,
  loading: false,
  error: null
};

const professionalReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_PROFESSIONALS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PROFESSIONALS_SUCCESS':
      return {
        ...state,
        professionals: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_PROFESSIONALS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'FETCH_NEARBY_PROFESSIONALS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_NEARBY_PROFESSIONALS_SUCCESS':
      return {
        ...state,
        nearbyProfessionals: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_NEARBY_PROFESSIONALS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'FETCH_PROFESSIONAL_DETAIL_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PROFESSIONAL_DETAIL_SUCCESS':
      return {
        ...state,
        currentProfessional: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_PROFESSIONAL_DETAIL_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_PROFESSIONAL_AVAILABILITY':
      return {
        ...state,
        currentProfessional: {
          ...state.currentProfessional,
          available: action.payload
        },
        professionals: state.professionals.map(professional => 
          professional.id === state.currentProfessional.id 
            ? { ...professional, available: action.payload } 
            : professional
        ),
        nearbyProfessionals: state.nearbyProfessionals.map(professional => 
          professional.id === state.currentProfessional.id 
            ? { ...professional, available: action.payload } 
            : professional
        )
      };
    default:
      return state;
  }
};

export default professionalReducer;
