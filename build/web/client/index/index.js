"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Slider = _interopRequireDefault(require("@material-ui/lab/Slider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Index = () => {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = (0, _react.useState)(0);
  return _react.default.createElement("div", null, _react.default.createElement("p", null, "You clicked ", count, " times"), _react.default.createElement(_Button.default, {
    variant: "contained",
    color: "primary",
    onClick: () => setCount(count + 1)
  }, "Click me"));
};

var _default = Index;
exports.default = _default;