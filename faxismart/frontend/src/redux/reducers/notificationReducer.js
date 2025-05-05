// Reducer para gerenciamento de notificações
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_NOTIFICATIONS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_NOTIFICATIONS_SUCCESS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(notification => !notification.read).length,
        loading: false,
        error: null
      };
    case 'FETCH_NOTIFICATIONS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => 
          notification.id === action.payload 
            ? { ...notification, read: true } 
            : notification
        ),
        unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
        unreadCount: 0
      };
    case 'NEW_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    default:
      return state;
  }
};

export default notificationReducer;
