import { render } from 'react-dom'
import React from 'react'
import Routes from './router'

window.host = 'http://localhost:8080'

render(
  <Routes />,
  document.getElementById('root')
)
