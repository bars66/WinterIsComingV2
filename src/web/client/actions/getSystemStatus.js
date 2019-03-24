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
    manualControl
    switchReason {
      isEnabled
      reason
      time
    }
  }
  co2 {
    value
    lastUpdate
    st
    lastTrueValue {
      value
      lastUpdate
    }
  }
  temps {
    inside
    canal
    lastUpdate
  }
}`

export default () => {
  return async (dispatch, getState) => {
    const data = await fetchGql(query)

    if (data.vent) {
      dispatch({ type: '@@vent/UPDATE', payload: data.vent })
    }

    if (data.co2) {
      dispatch({ type: '@@co2/UPDATE', payload: data.co2 })
    }

    if (data.temps) {
      dispatch({ type: '@@temps/UPDATE', payload: data.temps })
    }

    dispatch({ type: '@@loading/COMPLETE' })
  }
}
