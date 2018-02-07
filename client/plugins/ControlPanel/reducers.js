// ------------------------------------
// Reducer
// ------------------------------------
import { SWITCH_LIGHT } from './actions';

const ACTION_HANDLERS = {
  [SWITCH_LIGHT]: (state, action) => {
    return {
      ...state,
      isLightOn: !state.isLightOn
    };
  }
};

// init state
const initialState = {
  isLightOn: false
};

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};