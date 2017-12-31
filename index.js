const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const compression = require('compression');
const bodyParser = require('body-parser');
const dbGets = require('./sql/dbGets.js');
const dbSets = require('./sql/dbSets.js');
const s3 = require('./s3.js');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const knox = require('knox');
const bcrypt = require('./bcrypt.js');
const csurf = require('csurf');
const cookieSession = require('cookie-session');

var diskStorage = multer.diskStorage({
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

let onlineUsers = [];

app.use(compression());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieSession({
  secret: 'never reveal the wu tang secret',
  maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(csurf());

app.use(function(req, res, next) {
  res.cookie('wutang', req.csrfToken());
  next();
});

if (process.env.NODE_ENV != 'production') {
  app.use('/bundle.js', require('http-proxy-middleware')({target: 'http://localhost:8081/'}));
}

app.use(express.static('./public'));

app.get('/welcome/', function(req, res) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.sendFile(__dirname + '/index.html');
  }
});

io.on('connection', function(socket) {
  console.log(`socket with the id ${socket.id} is now connected`);

  socket.on('disconnect', function() {
    console.log(`socket with the id ${socket.id} is now disconnected`);

    let movinUserID;
    for (let i = 0; i < onlineUsers.length; i++) {
      if (onlineUsers[i].socketId == socket.id) {
        movinUserID = onlineUsers[i].userId;
        console.log('disconnected matched');
      }
    }

    onlineUsers = onlineUsers.filter(function(obj) {
      return obj.socketId !== socket.id;
    });

    let userIdCount = 0;
    console.log('before the loop, useridcountis', userIdCount);
    for (let i = 0; i < onlineUsers.length; i++) {
      if (movinUserID == onlineUsers[i].userId) {
        userIdCount++;
      }
    }
    console.log('is there multiple disconnects?', userIdCount);
    if (userIdCount < 2) {
      console.log('user took their connects and left, remainingUsers:', onlineUsers);
      io.sockets.emit('userLeft', {userLeft: movinUserID});
    } else {
      console.log('userStill here, had multiple connections');
    }
  });

});

app.get('/', function(req, res) {
  if (!req.session.user && req.url != '/welcome/') {
    res.redirect('/welcome/');
    return;
  } else {
    res.sendFile(__dirname + '/index.html');
  }
});

app.get('/connected/:socketId', function(req, res, next) {
  console.log('socket got a get request');
  if (!req.session.user) {
    return next();
  }

  if (onlineUsers.length > 10) {
    onlineUsers.shift()
  }
  onlineUsers.push({userId: req.session.user.id, socketId: req.params.socketId});
  const ids = onlineUsers.map(id => id.userId);
  dbGets.getUsersByIds(ids).then(function(results) {
    io.sockets.sockets[req.params.socketId].emit('usersOnline', results);
  });
  let movinUserID;
  for (let i = 0; i < onlineUsers.length; i++) {
    if (onlineUsers[i].socketId == req.params.socketId) {
      movinUserID = onlineUsers[i].userId;
      console.log('connected matched');
    }
  }
  let userIdCount = 0;
  console.log('before the loop, useridcountis', userIdCount);
  for (let i = 0; i < onlineUsers.length; i++) {
    if (movinUserID == onlineUsers[i].userId) {
      userIdCount++;
    }
  }
  console.log('is there multiple connects?', userIdCount);
  if (userIdCount < 2) {
    console.log('thats a new user, allUsers: ', onlineUsers);
    dbGets.getUserById(movinUserID).then(function(results) {
      io.sockets.emit('userJoined', results);
    });

  } else {
    console.log('user already connected');
  }
});

app.post('/register', function(req, res) {
  if (req.body.fname && req.body.lname && req.body.email && req.body.pword) {
    var password = req.body.pword.trim();
    bcrypt.hashPassword(password).then(function(hash) {
      dbSets.saveUserDetails(req.body.fname, req.body.lname, req.body.email, hash).then(function(results) {
        res.json({success: true});
      }).catch(function(err) {
        res.json({error: 'That E-Mail is in use..'});
      });
    });
  } else {
    res.json({error: 'Something is missing...'});
  }
});

app.post('/authorize', function(req, res) {
  if (req.body.email && req.body.pword) {
    dbGets.getUserByEmail(req.body.email).then(function(user) {
      let id = user.id;
      bcrypt.checkPassword(req.body.pword, user.hashedpass).then(function(doesMatch, id) {
        if (doesMatch) {
          req.session.user = {
            email: req.body.email,
            id: user.id
          };

          console.log('LOGGED IN');
          res.json({success: true});
        } else {
          res.json({error: 'There seems to be a mistake..'});
        }
      });
    }).catch(function(err) {
      res.json({error: 'There seems to be a mistake..'});
    });
  } else {
    res.json({error: 'There seems to be a mistake..'});
  }
});

app.get('/user', function(req, res) {
  dbGets.getUserByEmail(req.session.user.email).then(function(user) {

    res.json(user);
  });
});

app.get('/opp.json/:id', function(req, res) {
  const id = req.params.id;
  if (id == req.session.user.id) {
    res.json({success: false, redirect: true});
  } else {
    dbGets.getUserById(id).then(function(results) {
      if (results === 0) {
        console.log('nowt there');
        res.json({error: 'An error!', redirect: true});
      } else {
        res.json(results);
      }

    });
  }
});

app.get('/friend-request.json/:id', function(req, res) {
  const senderID = req.session.user.id;
  const recieverId = req.params.id;
  dbGets.getFriendStatus(senderID, recieverId).then(function(results) {
    if (results === 0) {
      console.log('nowt there');
      res.json(results);
    } else {
      res.json(results);
    }

  });
});

app.post('/friend-request.json/:id', function(req, res) {
  const senderID = req.session.user.id;
  const recieverId = req.params.id;
  if (req.body.nextAction == 0) {
    dbSets.newFriendRequest(senderID, recieverId, 1).then(function() {
      res.json({success: true, status: 1});
    });
  } else if (req.body.nextAction == 2) {
    dbSets.updateFriendRequest(4, senderID, recieverId).then(function() {
      res.json({success: true, status: 4});
    });
  } else if (req.body.nextAction == 3) {
    dbSets.deleteFriendRequest(senderID, recieverId).then(function() {
      console.log('dahleted');
      res.json({success: true, status: 0});
    });
  }
});

app.get('/allFriends.json', function(req, res) {
  console.log('getting a request for friends');
  dbGets.getAllFriends(req.session.user.id).then(function(results) {
    console.log('sent em', results);
    res.json(results);
  });
});

app.post('/uploadImage', uploader.single('profilepic'), function(req, res) {
  console.log('starting upload');
  if (req.file) {
    console.log("found a file");
    s3.upload(req.file).then(function() {
      dbSets.saveImage(req.file.filename, req.session.user.email).then(function(image) {
        res.json({success: true, image: image});
      });
    });
  } else {
    res.json({error: 'A smaller picture, perhaps?'});
  }
});

app.post('/uploadBio', function(req, res) {
  if (req.body.bio) {
    console.log('got a bio');
    dbSets.saveBio(req.body.bio, req.session.user.email).then(function(bio) {

      res.json({success: true, bio: bio});
    });
  } else {
    res.json({error: 'It appears to be blank.'});
  }
});

const messageArray = [];

app.post('/chat.json', function(req, res) {
  dbGets.getUserById(req.session.user.id).then(function(results) {
    let fullMessage = {
      fname: results.fname,
      lname: results.lname,
      profilepic: results.profilepic,
      message: req.body.messageContents,
      id: req.session.user.id
    }
    console.log('fullMessage', fullMessage);
    messageArray.push(fullMessage);
    console.log('arrayContents', messageArray);
    io.sockets.emit('newMessage', fullMessage);
  });
});

app.get('/chat.json', function(req, res) {
  console.log('get array', messageArray);
  res.json(messageArray);
});

app.get('/logout', function(req, res) {
  req.session = null;
  res.redirect('/welcome/');
});

app.get('*', function(req, res) {
  if (!req.session.user && req.url != '/welcome/') {
    res.redirect('/welcome/');
    return;
  } else {
    res.sendFile(__dirname + '/index.html');
  }
});

server.listen(process.env.PORT || 8080, function() {
  console.log("I'm listening.");
});
