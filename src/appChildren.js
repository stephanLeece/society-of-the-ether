import React from 'react';
import {Header, LMenu, RMenu} from './constants';
import {Link, browserHistory} from 'react-router';
import axios from './axios';

export class FriendButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    let id = this.props.id
    axios.get('/friend-request.json/' + id).then(({data}) => {
      if (data === 0) {
        console.log('no request');
        this.setState({status: 0})
      } else {
        this.setState(data);
        console.log('status', this.state.status);
      }
    })
  }

  getButtonTxt() {
    let n = this.state.status
    switch (n) {
      case 0:
        return 'Add Friend';
        break;
      case 1:
      if (this.props.id == this.state.sender_id) {
      return 'Accept Friend Request';
          break;
      } else {
        return 'Cancel Request';
        break;
      }
      case 4:
        return 'End Friendship';
        break;
    }
  }

  handleSubmit(e) {
    let nextAction;
    console.log('state', this.state);
    console.log('oppid', this.props.id, 'senderid', this.state.sender_id);
    if (this.state.status == 1) {
      // if your on the page of someone who sent you the request
      if (this.props.id == this.state.sender_id) {
        nextAction = 2;
        // next action = accept 2 set status to 4
      } else {
        nextAction = 3;
        // nextAction = cancel 3 delete row
      }
    } else if (this.state.status == 4) {
      nextAction = 3
      // nextAction = cancel 3 delete row
    } else {
      nextAction = this.state.status

    }

    let data = {
      receiverId: this.props.id,
      nextAction: nextAction
    }
    console.log('next', nextAction);
    let receiverId = this.props.id
    axios.post('/friend-request.json/' + receiverId, data).then(resp => {
      if (resp.data.success) {
        this.setState({status: resp.data.status})
      } else {
        this.setState({error: resp.data.error})
      }
    })

  }

  render() {
    return ((<div className="friendButton">

      <button onClick={this.handleSubmit}>{this.getButtonTxt()}</button>

    </div>))
  }
}

export class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {

    const {
      bio,
      fname,
      lname,
      profilepic,
      uploaderIsVisible,
      toggleUpload,
      setImage
    } = this.props

    return ((<div className="viewProfile">
    <div>  <img src={profilepic} alt=""/></div>
    <div>
      <h1>{fname} {lname}</h1>
      <p>{bio}</p>
        </div>
    </div>))
  }
}

export class UploadProfilePic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    let data = new FormData();
    data.append('profilepic', this.state.profilepic);
    axios.post('/uploadImage', data).then(resp => {
      console.log('sometiung');
      if (resp.data.success) {
        console.log('image', resp.data.image);
        this.props.setImage(resp.data.image.profilepic)
        this.props.toggleUpload();
      } else {
        this.setState({error: resp.data.error})
      }
    })
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.files[0]

    }, () => {
      console.log('new state', this.state);
    })
  }
  render() {
    console.log('upp', this.props);
    return (<div className="upp">



    <label className="fileContainer">
    Choose
      <input onChange={this.handleChange}  name="profilepic" type="file"></input>
    </label>




      <button onClick={this.handleSubmit}>Confirm</button>
      {this.state.error && <p>{this.state.error}</p>}
    </div>)
  }
}

export class UploadBio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    let data = {
      bio: this.state.bio
    }
    axios.post('/uploadBio', data).then(resp => {
      if (resp.data.success) {
        console.log(resp.data);
        console.log('bio', resp.data.bio);
        this.props.setBio(resp.data.bio.bio)
        this.props.toggleBio();
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
    return (<div className="upb">

      <textarea onChange={this.handleChange} name="bio"></textarea>
      <button onClick={this.handleSubmit}>Confirm</button>
      {this.state.error && <p>{this.state.error}</p>}
    </div>)
  }
}
