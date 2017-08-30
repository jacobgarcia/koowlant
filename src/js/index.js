import { render } from 'react-dom'
import React from 'react'
import Routes from './router'

window.host = 'http://54.241.156.65'

render(
  <Routes />,
  document.getElementById('root')
)
