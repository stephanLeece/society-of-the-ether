import axios from './axios';

export function getFriends() {
  return axios.get('/allFriends.json/').then(function(results) {
    console.log('action results', results.data);
    return {type: 'GET_FRIENDS', friends: results.data};
  });
}

export function acceptFriendRequest(id) {
  console.log('acceptin');
  let data = {
    receiverId: id,
    nextAction: 2
  }
  let receiverId = id
  return axios.post('/friend-request.json/' + receiverId, data).then(function() {
    return {type: 'ACCEPT_FRIEND_REQUEST', acceptedId: id};
  })
}

export function endFriendship(id) {
  console.log('endin');
  let data = {
    receiverId: id,
    nextAction: 3
  }
  let receiverId = id
  return axios.post('/friend-request.json/' + receiverId, data).then(function() {
    return {type: 'END_FRIEND', EndedId: id};
  })
}

export function usersOnline(users) {
  console.log('onlineData', users);
  return {type: 'USERS_ONLINE', users};
}
export function userJoined(id) {
  console.log('joinedData', id);
  return {type: 'NEW_USER', id};
}
export function userLeft(id) {
  console.log('leftData', id);
  return {type: 'USER_LEFT', id};
}

export function postMessage(message) {
  console.log('action sending message:', message);
  let data = {
  messageContents: message
  }
  return axios.post('/chat.json/', data).then(function(results) {
    return {type: 'NEW_MESSAGE', message};
  })
}

export function getMessages(messages) {
  return axios.get('/chat.json/').then(function({data}) {
    return {type: 'ALL_MESSAGES', messages: data};
  });

}
