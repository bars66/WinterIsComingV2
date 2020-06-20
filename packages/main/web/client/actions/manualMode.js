import fetchGql from '../fetchGql';

const query = `
mutation manualHeater($isEnabled: Boolean, $manualControl: Boolean) {
  manualHeater(isEnabled: $isEnabled, manualControl: $manualControl)
}
`;

export default (isEnabled, manualControl) => {
  return async (dispatch, getState) => {
    await fetchGql(query, {isEnabled, manualControl});
  };
};
