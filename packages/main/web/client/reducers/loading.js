export default function loadingReducer(state = false, action) {
  switch (action.type) {
    case '@@loading/COMPLETE':
      return true;

    default:
      return state;
  }
}
