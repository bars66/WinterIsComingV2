export default function grlndReducer(state = {}, action) {
  switch (action.type) {
    case '@@grlnd/UPDATE':
      return action.payload;

    default:
      return state;
  }
}
