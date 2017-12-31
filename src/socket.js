import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {} from './actions';
import * as io from 'socket.io-client';
import axios from './axios';
import {userJoined, userLeft, usersOnline, getMessages, postMessage} from './actions';
import {store} from './start'

let socket;

function getSocket() {
  if (!socket) {
    socket = io.connect();
    socket.on('connect', function() {
      console.log('received connect message');
      axios.get('/connected/' + socket.id)
    });

  socket.on('userJoined', function(data) {
    console.log('got a new user here in the front');
    store.dispatch(userJoined(data))
  })

  socket.on('userLeft', function(data) {
    console.log('we lost a user here in the front');
    store.dispatch(userLeft(data))
  })

  socket.on('usersOnline', function(data) {
    console.log('heres everyone');
    store.dispatch(usersOnline(data))
  })

  socket.on('newMessage', function(messageObj) {
    console.log('new message', messageObj);
    store.dispatch(getMessages(messageObj))
  })

}
return socket;
}




export {getSocket} ;
// const mapStateToProps = function(state) {
//
// }
//
// export default connect(mapStateToProps)(HotOrNot);
