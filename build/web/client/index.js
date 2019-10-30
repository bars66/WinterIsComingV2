"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _main = _interopRequireDefault(require("./main.jsx"));

var _planshet = _interopRequireDefault(require("./planshet.jsx"));

var _camera = _interopRequireDefault(require("./camera.jsx"));

var _reactRedux = require("react-redux");

var _store = _interopRequireDefault(require("./store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GetRoute = ({
  type
}) => {
  if (type === 'camera') return _react.default.createElement(_camera.default, null);
  if (type === 'planshet1') return _react.default.createElement(_planshet.default, null);
  return _react.default.createElement(_main.default, null);
};

const store = (0, _store.default)();

_reactDom.default.render(_react.default.createElement(_reactRedux.Provider, {
  store: store
}, _react.default.createElement(GetRoute, {
  type: window._TYPE
})), document.getElementById('root'));