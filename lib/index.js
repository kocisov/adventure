(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Adventure = factory());
}(this, (function () { 'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//      

var Adventure = function Adventure(_ref) {
  var _this = this;

  var _ref$debug = _ref.debug,
      debug = _ref$debug === undefined ? false : _ref$debug,
      handleError = _ref.handleError,
      handleMessage = _ref.handleMessage,
      _ref$maxReconnectAtte = _ref.maxReconnectAttempts,
      maxReconnectAttempts = _ref$maxReconnectAtte === undefined ? 3 : _ref$maxReconnectAtte,
      _ref$reconnect = _ref.reconnect,
      reconnect = _ref$reconnect === undefined ? false : _ref$reconnect,
      _ref$reconnectInterva = _ref.reconnectInterval,
      reconnectInterval = _ref$reconnectInterva === undefined ? 5000 : _ref$reconnectInterva,
      reduxDispatcher = _ref.reduxDispatcher,
      _ref$responseType = _ref.responseType,
      responseType = _ref$responseType === undefined ? 'json' : _ref$responseType,
      url = _ref.url;

  _classCallCheck(this, Adventure);

  this.open = function () {
    try {
      _this.ws = new WebSocket(_this.url);
    } catch (e) {
      if (_this.debug) {
        console.log('WebSocket > Error when connecting ' + e);
      }
    }

    _this.ws.onopen = function () {
      _this.onOpen();
    };

    _this.ws.onclose = function (event) {
      _this.onClose(event);
    };

    _this.ws.onerror = function (error) {
      _this.onError(error);
    };

    _this.ws.onmessage = function (message) {
      _this.onMessage(message);
    };
  };

  this.onOpen = function () {
    if (_this.debug) {
      console.log('WebSocket > Opened at ' + _this.url);
    }

    if (_this.reconnecting) {
      if (_this.debug) {
        console.log('WebSocket > Reconnected');
      }
      _this.clearReconnect();
    }

    _this.calledOnOpen = true;
  };

  this.onClose = function (event) {
    switch (event) {
      case 1000:
        if (_this.debug) {
          console.log('WebSocket > Disconnected');
        }

      default:
        if (_this.shouldReconnect) {
          _this.reconnecting = true;
          _this.reConnect(event);
        }
    }
  };

  this.reConnect = function (event) {
    if (!_this.shouldReconnect) {
      if (_this.debug) {
        console.log('Reconnect is disabled.');
      }
      return false;
    }

    if (_this.debug) {
      console.log('WebSocket > Reconnecting in ' + _this.reconnectInterval / 1000 + ' seconds');
    }

    if (_this.reconnecting) {
      if (_this.reconnectAttempts > _this.maxReconnectAttempts) {
        if (_this.debug) {
          console.log('WebSocket couldn\'t Reconnect in time of max reconnect attempts!');
        }

        return _this.clearReconnect();
      }

      if (!_this.intervalId) {
        _this.intervalId = setInterval(function () {
          if (_this.debug) {
            console.log('WebSocket > Reconnecting...');
            console.log('Current attempt:', _this.reconnectAttempts, 'Max count of Reconnects:', _this.maxReconnectAttempts);
          }
          _this.open();
          _this.reconnectAttempts++;
        }, _this.reconnectInterval);
      }
    } else {
      return _this.clearReconnect();
    }
  };

  this.clearReconnect = function () {
    clearInterval(_this.intervalId);
    _this.reconnecting = false;
    _this.reconnectAttempts = 0;
  };

  this.onError = function (error) {
    if (_this.handleError && typeof _this.handleError === 'function') {
      _this.handleError(error);
    }

    switch (error.code) {
      case 'ECONNREFUSED':
        if (_this.debug) {
          console.log('WebSocket > Error ' + error);
        }
        _this.reconnecting = true;
        _this.reConnect(error);

      default:
        if (_this.debug) {
          console.log('WebSocket > Error ' + error);
        }
    }
  };

  this.onMessage = function (message) {
    var msg = null;

    if (_this.responseType === 'json') {
      try {
        msg = JSON.parse(message.data);
      } catch (error) {
        if (_this.debug) {
          console.log('Couldn\'t parse > ' + error.data);
        }
      }
    } else {
      msg = message;
    }

    if (msg) {
      if (_this.reduxDispatcher && typeof _this.reduxDispatcher === 'function') {
        _this.reduxDispatcher(msg);
      }

      if (_this.handleMessage && typeof _this.handleMessage === 'function') {
        _this.handleMessage(msg);
      }
    }

    _this.number++;
  };

  this.send = function (data) {
    _this.ws.send(data);
  };

  this.nextSocketNumber = function () {
    return _this.number;
  };

  this.lastSocketNumber = function () {
    return _this.number - 1;
  };

  this.socketNumber = function () {
    if (_this.number !== 0) {
      return _this.number - 1;
    }
    return 0;
  };

  this.calledOnOpen = false;
  this.debug = debug;
  this.handleError = handleError;
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
};

return Adventure;

})));
