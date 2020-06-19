import React from 'react'
import ReactDOM from 'react-dom'
import Main from './main.jsx'
import Planshet from './planshet.jsx'
import Camera from './camera.jsx'

import { Provider } from 'react-redux'
import getStore from './store'

const GetRoute = ({ type }) => {
  if (type === 'camera') return <Camera />
  if (type === 'planshet1') return <Planshet />
  return <Main />
}

const store = getStore()

ReactDOM.render(<Provider store={store}><GetRoute type={window._TYPE} /></Provider>, document.getElementById('root'))
