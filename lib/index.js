(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Adventure = factory());
}(this, (function () { 'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//      

var Adventure = function Adventure(_ref) {
  var _this = this;

  var debug = _ref.debug,
      messageFunction = _ref.messageFunction,
      reconnect = _ref.reconnect,
      reconnectInterval = _ref.reconnectInterval,
      reduxCaller = _ref.reduxCaller,
      url = _ref.url;

  _classCallCheck(this, Adventure);

  this.onOpen = function () {
    if (_this.debug) {
      console.log('WebSocket > Opened at ' + _this.url);
    }
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
        _this.reConnect(error);

      default:
        if (_this.debug) {
          console.log('WebSocket > Error: ' + error);
        }
    }
  };

  this.onMessage = function (message) {
    var msg = null;

    try {
      msg = JSON.parse(message.data);
    } catch (error) {
      if (_this.debug) {
        console.log('Couldn\'t parse > ' + error.data);
      }
    }

    if (msg) {
      if (_this.reduxCaller && typeof _this.reduxCaller === 'function') {
        _this.reduxCaller(msg);
      }

      if (_this.messageFunction && typeof _this.messageFunction === 'function') {
        _this.messageFunction(msg);
      }
    }

    _this.number++;
  };

  this.getNextSocketNumber = function () {
    return _this.number + 1;
  };

  this.getSocketNumber = function () {
    return _this.number;
  };

  this.debug = debug;
  this.messageFunction = messageFunction;
  this.number = 0;
  this.reconnectInterval = reconnectInterval;
  this.reduxCaller = reduxCaller;
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
