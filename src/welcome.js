import React from 'react';
import axios from './axios';
import {Link} from 'react-router';
import {Constants, Header, LMenu, RMenu, Footer} from './constants';

export class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (<div className='main'>
      <header>
      <img id='logoBig' src="/images/logo.png" alt=""/>
      </header>
      <div className='jumbo welcome'>
        <LMenu/>
            <div className='content'>
            {this.props.children}
            </div>
        <RMenu/>
      </div>
    </div>);
  }
}


export class WelcomeText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='welcomeLanding'>
<img src='/images/welcome.png' alt=""/>
<div className = 'welcomeButtons'>
<Link to="/register">Register</Link>  <Link to="/login">Login</Link></div>
</div>
);
  }
}

export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // fname: '',
      // lname: '',
      // email: '',
      // pword: ''
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit() {
    const {fname, lname, email, pword} = this.state;
    const data = {
      fname,
      lname,
      email,
      pword
    };
    axios.post('/register', data).then(resp => {
      if (resp.data.success) {
        location.replace('/#/login');
      } else {
        this.setState({error: resp.data.error})
      }
    })
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      console.log('new state', this.state);
    })
  }
  render() {
    return (<div className='register welcomeContent'>
    <div className='wText'>
    <h2>Residents of the East End, take heed!</h2>
        <p>Upon registering you agree to only use this device under the supervision of someone of higher social standing. Anyone found in breach of these conditions should be escorted to the nearest sanitarium for the safety of themselves and those around them.</p>
</div><div className='wForm'>
      <p>Register:</p>
      <input onChange={this.handleChange} name="fname" type="text" placeholder="first name"></input>
      <input onChange={this.handleChange} name="lname" type="text" placeholder="last name"></input>
      <input onChange={this.handleChange} name="email" type="email" placeholder="email"></input>
      <input onChange={this.handleChange} name="pword" type="password" placeholder="password"></input>
      <button onClick={this.handleSubmit}>Submit</button>
      {this.state.error && <p>{this.state.error}</p>}
      </div>
    </div>)
  }
}

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pword: ''
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      console.log('new state', this.state);
    })
  }
  handleSubmit() {
    const {email, pword} = this.state;
    const data = {
      email,
      pword
    };
    axios.post('/authorize', data).then(resp => {
      if (resp.data.success) {
        console.log('FRONT SIDE SUCCESS');
        location.replace('/')
      } else {
        this.setState({error: resp.data.error})
      }
    })
  }
  render() {


    return (<div className='login welcomeContent'>
    <div className='wText'>
    <h2>Upon Setting off on your journey into the Ether, you agree to behave appropriatley:</h2>
    <p>- Vulgar language shall be kept to a minimum.</p>
    <p>- You shall not voyage while inebriated.</p>
    <p>- Ruses, lampoons or other actions commited with the intent to deceive will not be tolerated.</p>
    <h2>Any promotion of socialism shall be logged in triplicate and reported to the local constabulary.</h2>
</div><div className='wForm'>
      <p>Login:</p>

      <input onChange={this.handleChange} name="email" type="email" placeholder="email"></input>
      <input onChange={this.handleChange} name="pword" type="password" placeholder="password"></input>
      <button onClick={this.handleSubmit}>Submit</button>
  {this.state.error && <p>{this.state.error}</p>}
    </div></div>)
  }
}
