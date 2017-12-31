import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {} from './actions';
import {getSocket} from './socket';

const mapStateToProps = (state) => ({usersOnline: state.usersOnline});



class Online extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    console.log('mah props', this.props);
    let whosOnline = this.props.usersOnline
    if (!whosOnline) {

      return (<div className="online">
      <p>Noone online....</p>
      </div>);

    }

    const onlineList = whosOnline.map((user) => <div key={user.id}>
      <img className='listImg' src={user.profilepic} alt=""/>
  <Link to={`/opp/${user.id}`}>{user.fname}</Link>
    </div>);


    return (
  <div className="online">
      <h1>Whos Online?</h1>


      <div>{onlineList}</div>

    </div>
    )
  }
}

























export default connect(mapStateToProps)(Online);
