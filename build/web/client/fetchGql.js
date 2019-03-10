"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchGql;

var _isomorphicFetch = _interopRequireDefault(require("isomorphic-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function fetchGql(query, variables) {
  const response = await (0, _isomorphicFetch.default)('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  const result = await response.json();
  if (result.errors) return {};
  return result.data;
}

;