
export default function contextReducer(state = {}, action) {
  switch (action.type) {
    case '@@context/UPDATE':
      return action.payload;

    default:
      return state;
  }
}