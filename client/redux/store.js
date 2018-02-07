import { applyMiddleware, combineReducers, compose, createStore as createReduxStore } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';


let store = null;
const initialReducer = {
  routing: routerReducer,
  ...reducers
};

export const createStore = (initialState = {}, history) => {
  const middleware = [thunk, routerMiddleware(history)];
  let composeEnhancers = compose;
  if (__DEV__ && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  store = createReduxStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
    )
  );
  store.asyncModules = {};
  store.asyncReducers = {};
  store.injectReducer = injectReducer;
  store.registerAsyncModule = registerAsyncModule;
  store.getLoadedAsyncModule = getLoadedAsyncModule;

  if (module.hot) {
    module.hot.accept('./store', () => {
      store.replaceReducer(makeRootReducer(store.asyncReducers));
    });
  }

  return store;
};

export const getStore = () => {
  return store;
};

export const registerAsyncModule = (id, module) => {
  if (store.asyncModules[id]) console.error(`Fail to register an already existed module ${id}`);
  store.asyncModules[id] = module;
};

export const getLoadedAsyncModule = (id) => {
  return store.asyncModules[id];
};

const makeRootReducer = (asyncReducers) =>
  (state, action) => {
    return combineReducers({
      ...initialReducer,
      ...asyncReducers,
    })(action.type === 'redux/RESET_STATE' ? undefined : state, action);
  };

export const registerReducer = (key, reducer) => {
  if (initialReducer.hasOwnProperty(key)) return;
  initialReducer[key] = reducer;
};

const injectReducer = (key, reducer) => {
  if (initialReducer.hasOwnProperty(key) || store.asyncReducers.hasOwnProperty(key)) return;
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};
