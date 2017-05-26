// @flow

export default class Adventure {
  debug: boolean;
  messageFunction: any;
  number: number;
  reconnectInterval: number;
  reduxCaller: any;
  shouldReconnect: boolean;
  url: string;
  ws: any;

  constructor({
    debug,
    messageFunction,
    reconnect,
    reconnectInterval,
    reduxCaller,
    url
  }: any) {
    this.debug = debug;
    this.messageFunction = messageFunction;
    this.number = 0;
    this.reconnectInterval = reconnectInterval;
    this.reduxCaller = reduxCaller;
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
    if (!this.shouldReconnect) return false;

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
        this.reConnect(error);

      default:
        if (this.debug) {
          console.log(`WebSocket > Error: ${error}`);
        }
    }
  };

  onMessage = (message: any) => {
    let msg = null;

    try {
      msg = JSON.parse(message.data);
    } catch (error) {
      if (this.debug) {
        console.log(`Couldn't parse > ${error.data}`);
      }
    }

    if (msg) {
      if (this.reduxCaller && typeof this.reduxCaller === 'function') {
        this.reduxCaller(msg);
      }

      if (this.messageFunction && typeof this.messageFunction === 'function') {
        this.messageFunction(msg);
      }
    }

    this.number++;
  };

  getNextSocketNumber = () => {
    return this.number + 1;
  };

  getSocketNumber = () => {
    return this.number;
  };
}
