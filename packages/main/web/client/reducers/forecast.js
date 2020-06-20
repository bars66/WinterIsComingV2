export default function forecast2Reducer(state = {}, action) {
  switch (action.type) {
    case '@@forecast/UPDATE':
      return action.payload;

    default:
      return state;
  }
}
