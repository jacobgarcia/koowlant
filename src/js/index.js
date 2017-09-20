import { render } from 'react-dom'
import React from 'react'
import Routes from './router'

window.host = `${window.location}`.split('/')[0]

render(
  <Routes />,
  document.getElementById('root')
)
