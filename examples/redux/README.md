## Redux Example
Simple function that dispatches received messages to our reducers.

```js
function reduxDispatcher(message) {
  const { type, data: payload } = message;

  switch(type) {
    case 'RECEIVED_INFO':
      store.dispatch({
        type,
        payload
      });

    default:
      console.log('Received unspecified action type');
  }
}
```
