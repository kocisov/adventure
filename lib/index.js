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
      handleMessage = _ref.handleMessage,
      _ref$reconnect = _ref.reconnect,
      reconnect = _ref$reconnect === undefined ? false : _ref$reconnect,
      _ref$reconnectInterva = _ref.reconnectInterval,
      reconnectInterval = _ref$reconnectInterva === undefined ? 5000 : _ref$reconnectInterva,
      reduxDispatcher = _ref.reduxDispatcher,
      _ref$responseType = _ref.responseType,
      responseType = _ref$responseType === undefined ? 'json' : _ref$responseType,
      url = _ref.url;

  _classCallCheck(this, Adventure);

  this.onOpen = function () {
    if (_this.debug) {
      console.log('WebSocket > Opened at ' + _this.url);
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
          _this.reConnect(event);
        }
    }
  };

  this.reConnect = function (event) {
    if (!_this.shouldReconnect) return false;

    if (_this.debug) {
      console.log('WebSocket > Reconnecting in ' + _this.reconnectInterval / 1000 + ' seconds');
    }

    setTimeout(function () {
      if (_this.debug) {
        console.log('WebSocket > Reconnecting...');
      }
      _this.ws = new WebSocket(_this.url);
    }, _this.reconnectInterval);
  };

  this.onError = function (error) {
    switch (error.code) {
      case 'ECONNREFUSED':
        if (_this.debug) {
          console.log('WebSocket > Error: ' + error);
        }
        _this.reConnect(error);

      default:
        if (_this.debug) {
          console.log('WebSocket > Error: ' + error);
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

  this.nextSocketNumber = function () {
    return _this.number;
  };

  this.socketNumber = function () {
    return _this.number - 1;
  };

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

  this.ws.onopen = function () {
    _this.onOpen();
  };

  this.ws.onclose = function (event) {
    _this.onClose(event);
  };

  this.ws.onerror = function (error) {
    _this.onError();
  };

  this.ws.onmessage = function (message) {
    _this.onMessage(message);
  };
};

return Adventure;

})));
