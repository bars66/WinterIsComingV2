import fetchGql from '../fetchGql'

const query = `
query getVentStatus{
  vent {
    canaltTmp
    insideTmp
    heaterPower
    ventEnabled
    heaterEnabled
    temp
    heaterWatts
    lastAnswer
    switchReason {
      isEnabled
      reason
      time
    }
  }
}`

export default () => {
  return async (dispatch, getState) => {
    const data = await fetchGql(query)

    if (data.vent) {
      dispatch({ type: '@@vent/UPDATE', payload: data.vent })
    }

    dispatch({ type: '@@loading/COMPLETE' })
  }
}
