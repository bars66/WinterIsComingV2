import fetchGql from '../fetchGql';

const query = `
mutation setTemp($temp: Float!) {
  setTemp(temp: $temp)
}
`;

export default (temp) => {
  return async (dispatch, getState) => {
    await fetchGql(query, {temp});
  };
};
