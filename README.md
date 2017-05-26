# Adventure
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
  url: [string => 'ws://localhost:3000'],
  debug: [boolean],
  messageFunction: [function],
  reconnectInterval: [number],
  reduxCaller: [function],
  shouldReconnect: [boolean]
})

function reduxCaller(message) {
  const { type, data: payload } = message;

  switch(type) {
    case 'CHAT_MESSAGE':
      store.dispatch({
        type: 'CHAT_MESSAGE',
        payload
      });
    default:
      console.log('Received unspecified type');
  }
}
```
