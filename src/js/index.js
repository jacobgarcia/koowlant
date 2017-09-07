import { render } from 'react-dom'
import React from 'react'
import Routes from './router'

window.host = 'https://beta.kawlantid.com'
// window.host = 'http://localhost:8080'

render(
  <Routes />,
  document.getElementById('root')
)
