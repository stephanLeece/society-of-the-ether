import React from 'react';
import {Link} from 'react-router';




export class LMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (<div className='lMenu menu'>
<img id='ad' src="/images/heroin.png" alt=""/>
<img id='ad' src="/images/home.png" alt=""/>
<img id='ad' src="/images/horse.png" alt=""/>
    </div>)
  }
}

export class RMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (<div className='rMenu menu'>
<img id='ad' src="/images/inhaler.png" alt=""/>
<img id='ad' src="/images/opium.png" alt=""/>
<img id='ad' src="/images/pipes.png" alt=""/>
    </div>)
  }
}
