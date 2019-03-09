import React from "react";
import ReactDOM from "react-dom";
import Index from './index/index';

import { Provider } from 'react-redux'
import getStore from './store'

const store = getStore();

ReactDOM.render(<Provider store={store}><Index /></Provider>, document.getElementById("root"));