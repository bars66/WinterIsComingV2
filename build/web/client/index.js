"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _index = _interopRequireDefault(require("./index/index"));

var _reactRedux = require("react-redux");

var _store = _interopRequireDefault(require("./store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const store = (0, _store.default)();

_reactDom.default.render(_react.default.createElement(_reactRedux.Provider, {
  store: store
}, _react.default.createElement(_index.default, null)), document.getElementById("root"));