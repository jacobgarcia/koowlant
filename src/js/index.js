import { render } from 'react-dom'
import React from 'react'
import Routes from './router'

window.baseUrl = `${window.location.origin}/v1`

render(
  <Routes />,
  document.getElementById('root')
)
