import fetchGql from '../fetchGql'

const query = `
mutation manualHeater($isEnabled: Boolean) {
  manualHeater(isEnabled: $isEnabled)
}
`

export default (isEnabled) => {
  return async (dispatch, getState) => {
    await fetchGql(query, { isEnabled })
  }
}
