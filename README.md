# Adventure [![npm](https://img.shields.io/npm/v/@braind/adventure.svg)](http://npmjs.com/package/@braind/adventure) [![Code Climate](https://codeclimate.com/github/braind/adventure/badges/gpa.svg)](https://codeclimate.com/github/braind/adventure)
> Simple WebSocket client with dead-simple Redux integration

## Installation
```bash
# yarn
yarn add @braind/adventure

# npm
npm install @braind/adventure --save
```

## Usage
```js
import adventureClient from '@braind/adventure';

const adventure = new adventureClient({
  debug: [boolean],
  handleMessage: [function],
  maxReconectAttempts: [number],
  reconnect: [boolean],
  reconnectInterval: [number],
  reduxDispatcher: [function],
  responseType: [json, text],
  url: [string => 'ws://localhost:3000']
});

function handleMessage(message) {
  console.log(message);

  if (message === 'Ping' || message.type === 'Ping') {
    adventure.send('Pong');
  }
}

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

const currentSocketNumber = adventure.socketNumber();
const nextSocketNumber = adventure.nextSocketNumber();
const lastSocketNumber = adventure.lastSocketNumber();
```
