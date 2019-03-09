import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'

import { Provider } from 'react-redux'
import getStore from './store'

const store = getStore()

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))
