"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contextReducer;

function contextReducer(state = {}, action) {
  switch (action.type) {
    case '@@vent/UPDATE':
      return action.payload;

    default:
      return state;
  }
}