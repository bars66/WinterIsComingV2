"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = grlndReducer;

function grlndReducer(state = {}, action) {
  switch (action.type) {
    case '@@grlnd/UPDATE':
      return action.payload;

    default:
      return state;
  }
}