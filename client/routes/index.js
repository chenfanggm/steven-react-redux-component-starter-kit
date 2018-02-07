import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import OneColumnLayout from '../containers/OneColumnLayout';
import AboutPage from './AboutPage';
import AsyncComponent from '../containers/commons/AsyncComponent';
import { getStore } from '../redux/store';
import { injectComponent } from '../utils';


export const createRoutes = () => {
  const store = getStore();
  const controlPanelLoader = () => injectComponent(store, 'controlPanel', import(/* webpackChunkName: "ControlPanel" */ '../plugins/ControlPanel'));

  return (
    <OneColumnLayout>
      <Switch>
        <Route exact path='/' component={AboutPage} />
        <Route exact path='/control-panel' component={() => <AsyncComponent moduleLoader={controlPanelLoader} />} />
        <Redirect path='*' to='/' />
      </Switch>
    </OneColumnLayout>
  );
};
