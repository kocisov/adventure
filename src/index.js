// @flow

export default class Adventure {
  calledOnOpen: boolean;
  debug: boolean;
  handleMessage: any;
  intervalId: any;
  maxReconectAttempts: number;
  number: number;
  reconnectAttempts: number;
  reconnecting: boolean;
  reconnectInterval: number;
  reduxDispatcher: any;
  responseType: 'json' | 'text';
  shouldReconnect: boolean;
  url: string;
  ws: any;

  constructor({
    debug = false,
    handleMessage,
    maxReconnectAttempts = 3,
    reconnect = false,
    reconnectInterval = 5000,
    reduxDispatcher,
    responseType = 'json',
    url
  }: any) {
    this.calledOnOpen = false;
    this.debug = debug;
    this.handleMessage = handleMessage;
    this.maxReconnectAttempts = maxReconnectAttempts;
    this.number = 0;
    this.reconnectAttempts = 0;
    this.reconnecting = false;
    this.reconnectInterval = reconnectInterval;
    this.reduxDispatcher = reduxDispatcher;
    this.responseType = responseType;
    this.shouldReconnect = reconnect;
    this.url = url;

    this.open();
  }

  open = () => {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.onOpen();
    };

    this.ws.onclose = (event: any) => {
      this.onClose(event);
    };

    this.ws.onerror = (error: any) => {
      this.onError(error);
    };

    this.ws.onmessage = (message: any) => {
      this.onMessage(message);
    };
  };

  onOpen = () => {
    if (this.debug) {
      console.log(`WebSocket > Opened at ${this.url}`);
    }

    if (this.reconnecting) {
      if (this.debug) {
        console.log('WebSocket > Reconnected');
      }
      this.clearReconnect();
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
          this.reconnecting = true;
          this.reConnect(event);
        }
    }
  };

  reConnect = (event: any) => {
    if (!this.shouldReconnect) {
      if (this.debug) {
        console.log('Reconnect is disabled.');
      }
      return false;
    }

    if (this.debug) {
      console.log(
        `WebSocket > Reconnecting in ${this.reconnectInterval / 1000} seconds`
      );
    }

    if (this.reconnecting) {
      if (this.reconnectAttempts > this.maxReconnectAttempts) {
        if (this.debug) {
          console.log(
            `WebSocket couldn't Reconnect in time of max reconnect attempts!`
          );
        }

        return this.clearReconnect();
      }

      if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          if (this.debug) {
            console.log(`WebSocket > Reconnecting...`);
            console.log(
              'Current attempt:',
              this.reconnectAttempts,
              'Max count of Reconnects:',
              this.maxReconnectAttempts
            );
          }
          this.open();
          this.reconnectAttempts++;
        }, this.reconnectInterval);
      }
    } else {
      return this.clearReconnect();
    }
  };

  clearReconnect = () => {
    clearInterval(this.intervalId);
    this.reconnecting = false;
    this.reconnectAttempts = 0;
  }

  onError = (error: any) => {
    switch (error.code) {
      case 'ECONNREFUSED':
        if (this.debug) {
          console.log(`WebSocket > Error ${error}`);
        }
        this.reconnecting = true;
        this.reConnect(error);

      default:
        if (this.debug) {
          console.log(`WebSocket > Error ${error}`);
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

  lastSocketNumber = () => {
    return this.number - 1;
  };

  socketNumber = () => {
    if (this.number !== 0) {
      return this.number - 1;
    }
    return 0;
  };
}
