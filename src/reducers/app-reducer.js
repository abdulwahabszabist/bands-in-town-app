import { AppActionTypes } from '../actions/app-actions';

export const appReducer = (state, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case AppActionTypes.TOGGLE_APP_LOADING:
      return {
        ...state,
        isLoading: payload
      };

    case AppActionTypes.FETCH_EVENT_INFO:
      return {
        ...state,
        selectedEvent: payload
      };

    case AppActionTypes.FETCH_ARTIST_INFO:
      return {
        ...state,
        ...payload
      };

    default:
      return state;
  }
};
