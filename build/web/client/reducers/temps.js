"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tempsReducer;

function tempsReducer(state = {}, action) {
  switch (action.type) {
    case '@@temps/UPDATE':
      return action.payload;

    default:
      return state;
  }
}