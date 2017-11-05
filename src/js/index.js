import { render } from 'react-dom'
import React from 'react'
import Routes from './router'

window.baseUrl = 'https://demo.kawlantid.com/v1'

render(
  <Routes />,
  document.getElementById('root')
)
