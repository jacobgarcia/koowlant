import { render } from 'react-dom'
import React from 'react'
import Routes from './router'

window.baseHost = 'https://demo.kawlantid.com'
// window.baseHost = 'http://localhost:8080'
window.baseUrl = `${window.baseHost}/v1`

render(
  <Routes />,
  document.getElementById('root')
)
