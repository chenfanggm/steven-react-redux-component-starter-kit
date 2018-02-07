import React from 'react';
import jsonp from 'jsonp';


// plugins
//export const controlPanel = (store) => () => injectComponent(store, 'controlPanel', import(/* webpackChunkName: "ControlPanel" */ './ControlPanel'));
export const controlPanel = (store) => () => loadComponent(store, 'controlPanel');

const loadComponent = (store, id) => {
  const module = store.getLoadedAsyncModule(id);
  if (module) return Promise.resolve(module);

  return new Promise((resolve, reject) => {
    jsonp(`/plugins/${id}.chunk.js`, { timeout: 5000, name: `${id}Callback` }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  })
    .then((module) => {
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

// helper
const injectComponent = (store, id, moduleProvider) => {
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