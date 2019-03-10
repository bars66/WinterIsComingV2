import React from 'react'
import { connect } from 'react-redux'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import getCO2Color from '../utils/getCO2color'

const CO2 = ({ value }) => {
  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardHeader
        title='CO2'
        titleTypographyProps={{
          variant: 'display2',
        }}
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
    </Card>
  )
}

export default connect(({ co2 }) => co2)(CO2)
