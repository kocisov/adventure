import { createStore } from 'redux';

const RECEIVED_INFO = 'RECEIVED_INFO';

function reducer(state = {}, action) {
  switch(action.type) {
    case RECEIVED_INFO:
      return {
        ...state,
        ...action.payload
      }

    default:
      return state;
  }
}

export default createStore(reducer);
