import React from 'react'
import { connect } from 'react-redux'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import getCO2Color from '../utils/getCO2color'

const CO2 = ({ value, lastUpdate, st, lastTrueValue }) => {
  let body;
  if (lastTrueValue) {
    body = <CardContent>
      <Typography>Last stable: val: <b>{lastTrueValue.value}</b> at {(new Date(+lastTrueValue.lastUpdate)).toISOString()}</Typography>
    </CardContent>
  }
  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardHeader
        title='CO2'
        titleTypographyProps={{
          variant: 'display2',
        }}
        subheader={<React.Fragment>{(new Date(+lastUpdate)).toISOString()}; st: {st}</React.Fragment>}
        avatar={
          <Avatar style={{
            width: 60,
            height: 60,
            color: '#fff',
            backgroundColor: getCO2Color(value)
          }}>
            {value}
          </Avatar>
        } />
      {!!body && body}
    </Card>
  )
}

export default connect(({ co2 }) => co2)(CO2)
