# Adventure [![npm](https://img.shields.io/npm/v/@braind/adventure.svg)](http://npmjs.com/package/@braind/adventure)
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
  reconnect: [boolean],
  reconnectInterval: [number],
  reduxDispatcher: [function],
  url: [string => 'ws://localhost:3000'],
  responseType: [json, text]
});
```
