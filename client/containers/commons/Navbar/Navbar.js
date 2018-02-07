import React from 'react';
import Branding from '../Branding';
import MainMenu from '../../MainMenu/index';
import classes from './Navbar.scss';


const Navbar = () => (
  <header className={classes.container}>
    <Branding title='Chen' />
    <MainMenu />
  </header>
);

export default Navbar;
