export default function co2Reducer(state = {}, action) {
  switch (action.type) {
    case '@@co2/UPDATE':
      return action.payload;

    default:
      return state;
  }
}
