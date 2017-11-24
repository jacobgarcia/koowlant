import React, { Component } from 'react'
import Reflv from 'reflv'

class StreamFlashless extends Component {
  render(){
    return(
      <Reflv url="http://192.168.100.25:8000/live/idiots.flv" type="flv" autoplay="false"/>
    )
  }
}

export default StreamFlashless
