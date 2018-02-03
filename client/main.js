import './normalize';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from './redux/store';
import createHistory from 'history/createBrowserHistory';
import { createRoutes } from './routes';
import { AppContainer } from 'react-hot-loader';
import App from './containers/App';


// --------------------------------------
// Store Instantiation
// --------------------------------------
const initialState = window.__INITIAL_STATE__;
const history = createHistory();
const store = createStore(initialState, history);
const routes = createRoutes();

// --------------------------------------
// Render Setup
// --------------------------------------
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  ReactDOM.render(
    <AppContainer>
      <App store={store}
           history={history}
           routes={routes} />
    </AppContainer>,
    MOUNT_NODE
  );
};

// Development Tools
if (__DEV__) {
  if (module.hot) {
    const renderApp = render;
    const renderError = (error) => {
      const RedBox = require('redbox-react').default;
      ReactDOM.render(
        <RedBox error={error} />,
        MOUNT_NODE);
    };

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp();
      } catch (error) {
        console.error(error);
        renderError(error);
      }
    };

    if (module.hot) {
      module.hot.accept('./routes', () =>
        render()
      );
    }
  }
}

// --------------------------------------
// Go!
// --------------------------------------
render();
