export default function reducer(state = {}, action) {

  if (action.type == 'GET_FRIENDS') {
    state = Object.assign({}, state, {friends: action.friends});
  }

  if (action.type == 'ACCEPT_FRIEND_REQUEST') {
    console.log(action);
    state = Object.assign({}, state, {
      friends: state.friends.map(friend => {
        if (friend.id == action.acceptedId) {
          return Object.assign({}, friend, {status: 4})
        } else {
          return friend;
        }
      })
    });
  }

  if (action.type == 'END_FRIEND') {
    console.log(action);
    state = Object.assign({}, state, {
      friends: state.friends.map(friend => {
        if (friend.id == action.EndedId) {
          return Object.assign({}, friend, {status: 0})
        } else {
          return friend;
        }
      })
    });
  }

  if (action.type == 'USERS_ONLINE') {
    state = Object.assign({}, state, {usersOnline: action.users});
  }

  if (action.type == 'NEW_USER') {
    state = Object.assign({}, state, {
      usersOnline: state.usersOnline.concat(action.id)
    })
  }

  if (action.type == 'USER_LEFT') {
    console.log('wont match', action.id.userLeft);
    state = Object.assign({}, state, {
      usersOnline: state.usersOnline.filter(usersOnline => usersOnline.id !== action.id.userLeft)
    })
    console.log(state.usersOnline);
  }

  if (action.type == 'ALL_MESSAGES') {
    state = Object.assign({}, state, {messages: action.messages});
    console.log('reducer message for all', action.messages);
  }

  if (action.type == 'NEW_MESSAGE') {
    state = Object.assign({}, state, {
      messages: state.messages.concat(action.message)
    })

    console.log('reducer message for new', action.message);
  }

  return state;

}

// let n = this.state.status
// switch (action.type) {
//   case '':
//     return 'Add Friend';
//     break;
// }
