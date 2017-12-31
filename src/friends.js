import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {getFriends, acceptFriendRequest, endFriendship} from './actions';

const mapStateToProps = (state) => ({
  friends: state.friends && state.friends.filter(request => request.status == 4),
  pendFriends: state.friends && state.friends.filter(request => request.status == 1)
});

const mapDispatchToProps = (dispatch) => ({
  getFriends: () => dispatch(getFriends()),
  acceptFriendRequest: (id) => dispatch(acceptFriendRequest(id)),
  endFriendship: (id) => dispatch(endFriendship(id))
});

class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    if (!this.props.friends) {
      this.props.getFriends();
      console.log('yeah i got friends', this.props);
    }
  }

  render() {
    console.log('yeah i got rendered friends', this.props);
    let friends = this.props.friends;
    let pends = this.props.pendFriends
    if (!friends && !pends) {

      return (<div className="friendLists">
        <h1>No friends yet....</h1>
      </div>);

    }

    const friendList = friends.map((friend) => <div key={friend.id}>

      <Link to={`/opp/${friend.id}`}>{friend.fname}</Link>
      <img className='listImg' src={friend.profilepic} alt=""/>
      <button onClick={() => this.props.endFriendship(friend.id)}>End</button>
    </div>);

    const pendList = pends.map((pend) => <div key={pend.id}>
      <Link to={`/opp/${pend.id}`}>{pend.fname}</Link>
      <img className='listImg' src={pend.profilepic} alt=""/>
      <button onClick={() => this.props.acceptFriendRequest(pend.id)}>Accept</button>
    </div>);

    return (<div className="allFriends">

      <div className='friendList'>

        <h1>Potential Chums</h1>
        <div>{pendList}</div>
        </div>

      <div className='friendList'>
        <h1>Current Chums</h1>

        <div >{friendList}</div>
      </div>

    </div>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
// dynamically generate links for each friend that goes to their page.
// each friend div should show name, progile image and button to add/end friend.
// for accept friend, action will pass oppid, and update to friends state.
// for end friend, action will pass oppid and delete row
//  <Link to="/opp/{id}">opp</Link>
