export default function tempsReducer(state = {}, action) {
  switch (action.type) {
    case '@@temps/UPDATE':
      return action.payload;

    default:
      return state;
  }
}
