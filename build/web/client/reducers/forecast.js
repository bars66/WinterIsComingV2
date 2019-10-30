"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = forecast2Reducer;

function forecast2Reducer(state = {}, action) {
  switch (action.type) {
    case '@@forecast/UPDATE':
      return action.payload;

    default:
      return state;
  }
}