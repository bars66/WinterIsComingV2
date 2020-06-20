export default function contextReducer(state = {}, action) {
  switch (action.type) {
    case '@@vent/UPDATE':
      return action.payload;

    default:
      return state;
  }
}
