import React from 'react';
import { getStore, registerReducer } from '../redux/store';


/*************
 * Framework
 *************/
export const registerComponent = (component) => {
  const { Component, id, reducers } = component;
  if (Component) {
    // register reducer
    if (id && reducers) {
      registerReducer(id, reducers);
    }
    return Component;
  }
};

export const injectComponent = (component) => {
  const { Component, id, reducers } = component;
  const store = getStore();
  console.log('inject', Component, id, reducers);
  if (store && Component) {
    // inject reducer
    if (id && reducers) {
      store.injectReducer(id, reducers);
    }

    return class extends React.Component {
      render() {
        const { children } = this.props;
        return (
          <Component children={children} />
        );
      }
    };
  }
};


/*************
 * Request
 *************/
export const errorFilter = ({ withJsonFilter } = { withJsonFilter: true }) =>
  (response) => {
    if (!response.ok) {
      throw response;
    }

    if (withJsonFilter) {
      return response.json();
    }

    return response;
  };

export const getQueryString = (queryParams) => {
  const searchString = '';
  Object.keys(queryParams).map((key) => {
    if (searchString) {
      searchString.concat(`&${key}=${queryParams[key]}`);
    } else {
      searchString.concat(`?${key}=${queryParams[key]}`);
    }
  });
  return searchString;
};

/*************
 * Validation
 *************/
export const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email);
};
