import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

// src
import { MuiTheme, AppContext } from '../../constants';
import { useCustomReducer, isSomething } from './../../utils';
import { appReducer } from '../../reducers/app-reducer';
import { fetchArtist } from '../../actions/app-actions';

// styles
import './App.scss';
import Home from '../../views/Home/Home';
import Event from '../../views/Event/Event';
import Header from '../Header';

function App() {
  const [state, dispatch] = useCustomReducer(appReducer, {
    isLoading: false,
    events: [],
    artist: {}
  });
  const lastSearchArtist = localStorage.getItem('artist');

  useEffect(() => {  //this code is used for cache management. untill and unless cache of browser is cleared last search will be available
    if (isSomething(lastSearchArtist)) {
      dispatch(fetchArtist(lastSearchArtist));
    }
  }, []);

  const appContext = { state, dispatch };
  return (
    <AppContext.Provider value={appContext}>
      <ThemeProvider theme={MuiTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <div className="App">
          <CssBaseline />
          <BrowserRouter basename={'/'}>
            <Header />
            <Switch> //these are redirecting urls. this triggers whenever any static url is entered into browser 
              <Route exact path="/" render={() => <Home lastSearchArtist={lastSearchArtist} />} />
              <Route exact path="/event/:id" component={Event} />
              <Route exact path="*" render={() => <Redirect to="/" />} />
            </Switch>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
