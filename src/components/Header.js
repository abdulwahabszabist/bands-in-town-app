import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, makeStyles } from '@material-ui/core';
import { AppIcon } from './../assets/icons';
import AppLogo from './../assets/icons/logo.svg';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

const Header = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"> */}
        <NavLink to="/">
          <AppIcon component={AppLogo} width="24" height="24" />
        </NavLink>
        {/* </IconButton> */}
        &nbsp; &nbsp;
        <Typography variant="h6" className={classes.title}>
          Bands In Town
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
