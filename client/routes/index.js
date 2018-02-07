import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import OneColumnLayout from '../containers/OneColumnLayout';
import AboutPage from './AboutPage';
import AsyncComponent from '../containers/commons/AsyncComponent';
import { getStore } from '../redux/store';
import { createModuleLoader } from '../plugins';


export const createRoutes = () => {
  const store = getStore();

  return (
    <OneColumnLayout>
      <Switch>
        <Route exact path='/about' component={AboutPage} />
        <Route exact path='/control-panel' component={() => <AsyncComponent moduleLoader={createModuleLoader(store, 'controlPanel')} />} />
        <Redirect path='*' to='/' />
      </Switch>
    </OneColumnLayout>
  );
};
