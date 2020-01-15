import React, { useRef, useEffect, useContext, useState } from 'react';

import {
  Container,
  makeStyles,
  InputAdornment,
  FormControl,
  OutlinedInput,
  CircularProgress,
  Typography,
  IconButton,
  Fab,
  Link,
  Badge,
  CardContent,
  Card,
  Button,
  Grid
} from '@material-ui/core';
import moment from 'moment';
import { debounce } from 'throttle-debounce';
import DateFnsUtils from '@date-io/date-fns';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import SearchIcon from '@material-ui/icons/Search';
import { isSomething, isNothing } from '../../utils';
import { fetchArtist } from '../../actions/app-actions';
import { AppContext } from '../../constants';

import FacebookIcon from './../../assets/icons/facebook.svg';
import BITIcon from './../../assets/icons/bitFist.svg';
import { AppIcon } from '../../assets/icons';
import { filter, propOr } from 'ramda';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  searchInput: {
    margin: theme.spacing(1),
    backgroundColor: '#fff',
    borderRadius: 5
  },
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    zIndex: 10
  },
  card: {
    minWidth: 275,
    maxWidth: 350
  },
  title: {
    fontSize: 14
  },
  text: {
    color: '#fff'
  }
}));

//home page code starts from here

const Home = ({ history, lastSearchArtist }) => {
  const classes = useStyles();
  const inputRef = useRef(lastSearchArtist);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredData] = useState([]);
  const {
    state: { isLoading, artist = {}, events = [] },
    dispatch
  } = useContext(AppContext);

  useEffect(() => {
    setFilteredData(events);
  }, [events]);

  const handleSearch = v => {
    dispatch(fetchArtist(v));
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    const selectedEvents = filter(i => moment(i.datetime).isAfter(date), events);
    setFilteredData(selectedEvents);
  };

  return ( // main view code starts here. here we use artist name and its events list 
    <div className="home-container" style={{ backgroundImage: `url(${artist['image_url']})` }}>
      {isSomething(artist) && ( //whole view is set using material.ui that is component of react js
        <div
          className="artist-backlay"
          style={{ backgroundImage: `url(${artist['image_url']})` }}
        />
      )}
      <Container maxWidth="sm" className={classes.container}>
        <FormControl fullWidth className={classes.searchInput} variant="outlined">
          <OutlinedInput
            placeholder="Search Artists..."
            id="outlined-adornment-amount"
            defaultValue={inputRef.current}
            onChange={debounce(1000, false, () => {
              handleSearch(inputRef.current.value);
            })}
            inputProps={{
              ref: inputRef
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </FormControl>
      </Container>
      {isLoading ? (
        <div className="cover-all">
          <CircularProgress />
        </div>
      ) : (
        <Container maxWidth="lg" className={classes.container}>
          {isNothing(propOr('', 'value', inputRef.current)) ? (
            <Typography>Search any Artist to view its upcoming events</Typography>
          ) : isNothing(artist) && isSomething(propOr('', 'value', inputRef.current)) ? (
            <Typography>
              No Artist exists with name <b>{propOr('', 'value', inputRef.current)}</b>
            </Typography>
          ) : (
            <>
              <div className="artist-info">
                <Typography className={classes.text} variant="h1">
                  {artist.name}
                </Typography>
                <div className="actions">
                  <Link href={artist.url}>
                    <Fab variant="round">
                      <AppIcon component={BITIcon} width={20} heigth={20} />
                    </Fab>
                  </Link>
                  <Link href={artist['facebook_page_url']}>
                    <Fab variant="round">
                      <AppIcon component={FacebookIcon} width={25} heigth={25} />
                    </Fab>
                  </Link>
                </div>
              </div>
              {isNothing(events) ? (
                <Typography className={classes.text} variant="subtitle1">
                  No upcoming events found of this Artist
                </Typography>
              ) : (
                <>
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className="events-header">
                    <Badge badgeContent={artist['upcoming_event_count']} color="primary">
                      <Typography className={classes.text} variant="subtitle1">
                        Upcoming Events
                      </Typography>
                    </Badge>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        label="Search Events from"
                        format="MMM dd, yyyy"
                        value={selectedDate}
                        onChange={handleDateChange}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid container className="upcoming-events" spacing={3}>
                    <Grid item xs={12}>
                      {isNothing(filteredEvents) && isSomething(events) && (
                        <Typography className={classes.text} variant="h5">
                          No events found beyond searched date
                        </Typography>
                      )}
                      {isNothing(events) && (
                        <Typography className={classes.text} variant="h5">
                          {artist.name} has no upcoming events
                        </Typography>
                      )}
                    </Grid>
                    {filteredEvents.map(event => {
                      const eventDate = moment(event.datetime);
                      return (
                        <Grid item xs={12} sm={12} md={6} className="event-row" key={event.id}>
                          <Card>
                            <CardContent className="content">
                              <div className="event-date">
                                <span className="month">{eventDate.format('MMM')}</span>
                                <span className="day">{eventDate.format('D')}</span>
                              </div>
                              <Typography variant="h5">{event.venue.name}</Typography>
                              <NavLink to={`/event/${event.id}`}>
                                <Button variant="contained" color="primary">
                                  View Event
                                </Button>
                              </NavLink>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </>
              )}
            </>
          )}
        </Container>
      )}
    </div>
  );
};

export default Home;
