import React from 'react';
import * as io from 'socket.io-client';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, redirect, hashHistory, browserHistory} from 'react-router';
import {Welcome, WelcomeText, Register, Login} from './welcome';
import {App, Profile, OtherProfile} from './app';
import Friends from './friends'
import Chat from './chat'
import Online from './online'
import {FriendButton, UserHome, UploadProfilePic, UploadBio} from './appChildren';
import {Constants, Header, LMenu, RMenu} from './constants';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';

export const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));



const loggedInRouter = (<Provider store={store}>
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/profile" component={Profile}/>
      <Route path="/friends" component={Friends}/>
      <Route path="/online" component={Online}/>
      <Route path="/chat" component={Chat}/>
      <Route path="/opp/:id" component={OtherProfile}/>
      <IndexRoute component={UserHome}/>
      <redirect from="*" to="/"/>
    </Route>
  </Router>
</Provider>);

const notLoggedInRouter = (<Provider store={store}>
  <Router history={hashHistory}>
    <Route path="/" component={Welcome}>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register}/>
      <IndexRoute component={WelcomeText}/>
    </Route>
  </Router>
</Provider>);


let router;
if (location.pathname === '/welcome/') {
  router = notLoggedInRouter;
} else {
  router = loggedInRouter;
}

ReactDOM.render(router, document.querySelector('#root'));
