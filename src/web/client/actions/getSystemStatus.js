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
  co2 {
    value
  }
  temps {
    inside
    canal
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
      dispatch({ type: '@@temps/UPDATE', payload: data.co2 })
    }

    dispatch({ type: '@@loading/COMPLETE' })
  }
}
