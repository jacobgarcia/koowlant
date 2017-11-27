import React, { Component } from 'react'
import Reflv from 'reflv'

class StreamFlashless extends Component {
  render(){
    return(
      <Reflv url="https://demo.kawlantid.com:8000/live/idiots.flv" type="flv" autoplay="false"/>
    )
  }
}

export default StreamFlashless
