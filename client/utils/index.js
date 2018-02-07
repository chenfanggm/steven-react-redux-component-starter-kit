import React from 'react';


export const injectComponent = (store, id, moduleProvider) => {
  const module = store.getLoadedAsyncModule(id);
  if (module) return Promise.resolve(module);

  return moduleProvider.then((module) => {
    if (module && module.default) {
      store.registerAsyncModule(id, module.default);
      const { reducers } = module.default;
      if (reducers) {
        store.injectReducer(id, reducers);
      }
      return module.default;
    } else {
      return (<div>Get empty async module</div>);
    }
  });
};

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

export const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email);
};
