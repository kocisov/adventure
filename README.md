# Adventure [![npm](https://img.shields.io/npm/v/@braind/adventure.svg)](http://npmjs.com/package/@braind/adventure) [![Code Climate](https://codeclimate.com/github/braind/adventure/badges/gpa.svg)](https://codeclimate.com/github/braind/adventure) [![gzip size](http://img.badgesize.io/https://unpkg.com/@braind/adventure/lib/index.js?compression=gzip&label=gzip%20size)]()
> Simple WebSocket Client

## Features
- Reconnect implemented
- Handle Errors and Messages + Redux with your simple functions

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
import store from './redux/store';

const adventure = new adventureClient({
  debug: true,
  handleMessage,
  maxReconectAttempts: 5,
  reconnect: true,
  reconnectInterval: 5000,
  reduxDispatcher,
  responseType: 'json',
  url: 'ws://localhost:3000'
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

## API

#### adventureClient([opts])
Creates Adventure Client

##### Options
- debug: boolean - default is false,
- handleError: function - optional,
- handleMessage: function - optional,
- maxReconectAttempts: number - default is 3,
- reconnect: boolean - default is false,
- reconnectInterval: number - default is 5000ms,
- reduxDispatcher: function - optional,
- responseType: [json, text] - default is json,
- url: string -> 'ws://localhost:3000' - required

