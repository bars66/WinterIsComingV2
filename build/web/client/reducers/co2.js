"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = co2Reducer;

function co2Reducer(state = {}, action) {
  switch (action.type) {
    case '@@co2/UPDATE':
      return action.payload;

    default:
      return state;
  }
}