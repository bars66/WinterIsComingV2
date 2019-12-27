import fetchGql from '../fetchGql'

const query = `
mutation setGrlnd($pwmRY: Int, $pwmGB: Int, $time: Int) {
  setGrlnd(pwmGB: $pwmGB, pwmRY: $pwmRY, time: $time)
}
`

export default (opts) => {
  return async (dispatch, getState) => {
    await fetchGql(query, { ...opts })
  }
}
