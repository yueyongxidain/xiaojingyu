import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { bootstrap } from './global/boot'

bootstrap().then(() => {
  ReactDOM.render(<App />, document.getElementById('root'))
})
