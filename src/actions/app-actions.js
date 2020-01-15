import { API } from './../constants';
import { isSomething } from '../utils';
import { pathOr, find, propEq } from 'ramda';

export const AppActionTypes = {
  TOGGLE_APP_LOADING: 'TOGGLE_APP_LOADING',
  FETCH_ARTIST_INFO: 'FETCH_ARTIST_INFO',
  FETCH_ARTIST_EVENTS: 'FETCH_ARTIST_EVENTS',
  FETCH_EVENT_INFO: 'FETCH_EVENT_INFO'
};

async function makeAPICall(endpoint) {
  try {
    const resp = await await fetch(endpoint);
    return resp.json();
  } catch (error) {
    console.error('Error while fetching data: ', error);
  }
}

export const toggleAppLoading = bool => {
  return {
    type: AppActionTypes.TOGGLE_APP_LOADING,
    payload: bool
  };
};

//this function is used to fetch events list from api
export const fetchEventInfo = id => {
  return async (dispatch, getState) => {
    dispatch(toggleAppLoading(true));
    const eventsList = pathOr([], ['events'], getState());
    const eventInfo = find(propEq('id', id), eventsList);

    dispatch({
      type: AppActionTypes.FETCH_EVENT_INFO,
      payload: eventInfo
    });
    dispatch(toggleAppLoading(false));
  };
};

//this function is used to fetch artist list against search input entered to search box of the app
export const fetchArtist = artistName => {
  return async (dispatch, getState) => {
    dispatch(toggleAppLoading(true));
    const artistInfo = await makeAPICall( //wait for fetching artist list
      `${API.BASE_URL}/artists/${artistName}?app_id=${API.APP_ID}`
    );
    let artistEvents = [];
    if (isSomething(artistInfo)) {
      artistEvents = await makeAPICall( // if artist is there in above call then check its events
        `${API.BASE_URL}/artists/${artistName}/events?app_id=${API.APP_ID}`
      );
    }
    dispatch({ // save artist name and events that will be viewed in app in views.
      type: AppActionTypes.FETCH_ARTIST_INFO,
      payload: {
        artist: artistInfo,
        events: artistEvents
      }
    });
    if (isSomething(artistInfo)) {  // data stored in localstorage for Cache management
      localStorage.setItem('artist', artistName);
    }
    dispatch(toggleAppLoading(false));
  };
};
