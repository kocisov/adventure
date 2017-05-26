import adventureClient from '@braind/adventure';
import store from './store';

function reduxDispatcher(message) {
  const { type, data: payload } = message;

  switch(type) {
    case 'RECEIVED_INFO':
      store.dispatch({
        type: 'RECEIVED_INFO',
        payload
      });

    default:
      console.log('Received unspecified action type');
  }
}

export default new adventureClient({
  url: 'ws://url',
  debug: true,
  reduxDispatcher,
  reconnect: true,
  reconnectInterval: 5000
});
