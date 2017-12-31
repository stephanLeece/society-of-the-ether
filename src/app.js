import React from 'react';
import {Header, LMenu, RMenu} from './constants';
import {Link, browserHistory} from 'react-router';
import axios from './axios';
import {FriendButton, UserHome, UploadProfilePic,UploadBio} from './appChildren';
import {getSocket} from './socket';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploaderIsVisible: false,
      bioIsVisible: false
    };
    this.toggleUpload = this.toggleUpload.bind(this)
    this.toggleBio = this.toggleBio.bind(this)
    this.setImage = this.setImage.bind(this)
    this.setBio = this.setBio.bind(this)
  }

  toggleUpload() {
    if (this.state.bioIsVisible) {
      this.setState({bioIsVisible: false})
    }
    this.setState({
      uploaderIsVisible: !this.state.uploaderIsVisible
    })
  }

  toggleBio() {
    if (this.state.uploaderIsVisible) {
      this.setState({uploaderIsVisible: false})
    }
    this.setState({
      bioIsVisible: !this.state.bioIsVisible
    })
  }

  setImage(imgUrl) {
    this.setState({profilepic: imgUrl})
  }

  setBio(aBio) {
    this.setState({bio: aBio})
  }

  componentDidMount() {

      getSocket();

    axios.get('/user').then(({data}) => {
      this.setState(data);
    })
  }
  render() {

    if (!this.state) {
      return (<h1>Loading...</h1>);
    }

    if (!this.state.profilepic) {
      this.setState({profilepic: 'https://www.menon.no/wp-content/uploads/person-placeholder.jpg'})
    }

    const {
      fname,
      lname,
      profilepic,
      bio,
      uploaderIsVisible,
      bioIsVisible
    } = this.state;


    var divStyle = {
     backgroundImage: 'url(' + profilepic + ')',

    };









    const children = React.cloneElement(this.props.children, {
      fname,
      lname,
      profilepic,
      bio,
      uploaderIsVisible,
      bioIsVisible,
      toggleUpload: this.toggleUpload,
      toggleBio: this.toggleBio,
      setImage: this.setImage,
      setBio: this.setBio
    })

    return (<div className='main'>
      <header>
        <img id='logoBig' src="/images/logo.png" alt=""/>
        <div className='menuBar'>
          <div className="menuButtons">
          <div><a href="/logout">Logout</a></div>
          <div><Link to="/chat">Chat</Link></div>
          <div><Link to="/online">Online</Link></div>
          <div><Link to="/friends">Friends</Link></div>
            <div><Link to="/profile">Edit</Link></div>
            <div style={divStyle}></div>

          </div>


        </div>
      </header>
      <div className='jumbo  app'>
        <LMenu/>
        <div className='content'>
          {children}
        </div>
        <RMenu/>
      </div>
    </div>)
  }
}

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {

    const {
      fname,
      lname,
      profilepic,
      bio,
      uploaderIsVisible,
      bioIsVisible,
      toggleUpload,
      toggleBio,
      setImage,
      setBio
    } = this.props

    return (<div className="profile">
      <div>
        <img src={profilepic} alt=""/>
        {uploaderIsVisible && <button onClick={() => toggleUpload()}>Cancel</button>}
        {!uploaderIsVisible && <button onClick={() => toggleUpload()}>Change</button>}
        {uploaderIsVisible && <UploadProfilePic toggleUpload={toggleUpload} setImage={setImage}/>}
      </div>

      <div>
        <h1>About me:</h1>
        {bio && <p>{bio}</p>}{
          !bio && <div>
              <h1>No bio yet...</h1>
              {bioIsVisible && <button onClick={() => toggleBio()}>Cancel</button>}
              {!bioIsVisible && <button onClick={() => toggleBio()}>Describe Yourself</button>}

            </div>
        }
        {bio && bioIsVisible && <button onClick={() => toggleBio()}>Cancel</button>}
        {bio && !bioIsVisible && <button onClick={() => toggleBio()}>Change</button>}
        {bioIsVisible && <UploadBio toggleBio={toggleBio} setBio={setBio}/>}
      </div>

    </div>)
  }
}

export class OtherProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let id = this.props.params.id
    axios.get('/opp.json/' + id).then(({data}) => {
      if (data.redirect) {
        browserHistory.push('/');
      } else {
        this.setState(data);
      }
    })
  }

  render() {

    return ((<div className="viewProfile">
    <div>  <img src={this.state.profilepic} alt=""/><FriendButton id={this.props.params.id}/></div>
    <div>
      <h1>{this.state.fname} {this.state.lname}</h1>
      <p>{this.state.bio}</p>
        </div>
    </div>))
  }
}




// if !state.profilr show create your profile, else show profile and edit button
// edit button on click shoe  input text, set state profile
