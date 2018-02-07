import React from 'react';


// plugins
export const controlPanel = (store) => () => injectComponent(store, 'controlPanel', import(/* webpackChunkName: "ControlPanel" */ './ControlPanel'));





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