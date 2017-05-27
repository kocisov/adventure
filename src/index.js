// @flow

export default class Adventure {
  calledOnOpen: boolean;
  debug: boolean;
  handleMessage: any;
  number: number;
  reconnectInterval: number;
  reduxDispatcher: any;
  shouldReconnect: boolean;
  responseType: 'json' | 'text';
  url: string;
  ws: any;

  constructor({
    debug = false,
    handleMessage,
    reconnect = false,
    reconnectInterval = 5000,
    reduxDispatcher,
    responseType = 'json',
    url
  }: any) {
    this.calledOnOpen = false;
    this.debug = debug;
    this.handleMessage = handleMessage;
    this.number = 0;
    this.reconnectInterval = reconnectInterval;
    this.reduxDispatcher = reduxDispatcher;
    this.responseType = responseType;
    this.shouldReconnect = reconnect;
    this.url = url;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.onOpen();
    };

    this.ws.onclose = (event: any) => {
      this.onClose(event);
    };

    this.ws.onerror = (error: any) => {
      this.onError();
    };

    this.ws.onmessage = (message: any) => {
      this.onMessage(message);
    };
  }

  onOpen = () => {
    if (this.debug) {
      console.log(`WebSocket > Opened at ${this.url}`);
    }

    this.calledOnOpen = true;
  };

  onClose = (event: any) => {
    switch (event) {
      case 1000:
        if (this.debug) {
          console.log(`WebSocket > Disconnected`);
        }

      default:
        if (this.shouldReconnect) {
          this.reConnect(event);
        }
    }
  };

  reConnect = (event: any) => {
    if (!this.shouldReconnect) {
      return false;
    }

    if (this.debug) {
      console.log(
        `WebSocket > Reconnecting in ${this.reconnectInterval / 1000} seconds`
      );
    }

    setTimeout(() => {
      if (this.debug) {
        console.log(`WebSocket > Reconnecting...`);
      }
      this.ws = new WebSocket(this.url);
    }, this.reconnectInterval);
  };

  onError = (error: any) => {
    switch (error.code) {
      case 'ECONNREFUSED':
        if (this.debug) {
          console.log(`WebSocket > Error: ${error}`);
        }
        this.reConnect(error);

      default:
        if (this.debug) {
          console.log(`WebSocket > Error: ${error}`);
        }
    }
  };

  onMessage = (message: any) => {
    let msg = null;

    if (this.responseType === 'json') {
      try {
        msg = JSON.parse(message.data);
      } catch (error) {
        if (this.debug) {
          console.log(`Couldn't parse > ${error.data}`);
        }
      }
    } else {
      msg = message;
    }

    if (msg) {
      if (this.reduxDispatcher && typeof this.reduxDispatcher === 'function') {
        this.reduxDispatcher(msg);
      }

      if (this.handleMessage && typeof this.handleMessage === 'function') {
        this.handleMessage(msg);
      }
    }

    this.number++;
  };

  send = (data: any) => {
    this.ws.send(data);
  };

  nextSocketNumber = () => {
    return this.number;
  };

  socketNumber = () => {
    if (this.number !== 0) {
      return this.number - 1;
    }
    return 0;
  };
}
