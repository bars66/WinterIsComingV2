"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadingReducer;

function loadingReducer(state = false, action) {
  switch (action.type) {
    case '@@loading/COMPLETE':
      return true;

    default:
      return state;
  }
}