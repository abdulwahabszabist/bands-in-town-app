import React, { useEffect, useContext } from 'react';
import {
  Typography,
  Container,
  Grid,
  makeStyles,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Link
} from '@material-ui/core';
import GoogleMapReact from 'google-map-react';
import moment from 'moment';
import InfoIcon from '@material-ui/icons/Info';

import { AppContext } from '../../constants';
import { fetchEventInfo } from '../../actions/app-actions';
import { propOr, join } from 'ramda';

const useStyles = makeStyles({
  card: {
    width: '100%'
  },
  media: {
    height: 140
  }
});

const Marker = ({ text }) => (
  <div
    title={text}
    style={{
      color: 'red',
      display: 'inline-flex',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '100%',
      transform: 'translate(-50%, -50%)'
    }}>
    <InfoIcon />
  </div>
);

const Event = ({ match }) => {
  const classes = useStyles();
  const {
    state: { selectedEvent = {}, events = [], isLoading = false },
    dispatch
  } = useContext(AppContext);

  useEffect(() => {
    dispatch(fetchEventInfo(match.params.id));
  }, [events]);

  const { artist = {}, datetime, venue = {}, id, url, lineup = [] } = selectedEvent;

  return (
    <div className="event-container">
      {isLoading ? (
        <div className="cover-all">
          <CircularProgress />
        </div>
      ) : (
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={4}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardMedia
                    variant="outlined"
                    className={classes.media}
                    image={
                      artist.image_url || 'https://s3.amazonaws.com/bit-photos/artistThumb.jpg'
                    }
                    title="Artist Image"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h4" color="primary">
                      {artist.name}
                    </Typography>
                    <Typography variant="body1" component="p">
                      {moment(datetime).format('MMM DD, YYYY')} @ {venue.name}
                    </Typography>
                    <Typography variant="body2" component="h2">
                      <b>Lineup:</b> {join(', ', lineup)}
                    </Typography>
                    <Typography variant="body2" color="primary" component="p">
                      {venue.city}, {venue.region}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Link href={url}>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={8}>
              <div style={{ width: '100%', height: '400px' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyAiWUn_8yzwpEo8Dk0OI5sbV2Ys67tIHp8' }}
                  defaultCenter={{
                    lat: parseFloat(propOr(53, 'latitude', venue)),
                    lng: parseFloat(propOr(54, 'longitude', venue))
                  }}
                  defaultZoom={11}>
                  <Marker lat={venue.latitude} lng={venue.longitude} text={venue.name} />
                </GoogleMapReact>
              </div>
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default Event;
