const fs = require("fs");
const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:Stephan:postgres@localhost:5432/social');
const config = require('./config.json');

module.exports.saveUserDetails = function(first, last, email, hashPass) {
  return db.query(`INSERT INTO users (fname, lname, email, hashedpass) VALUES ($1, $2, $3, $4) RETURNING id`, [first || null, last || null, email || null, hashPass || null]).then(function(results) {
      return results.rows[0].id;
    })
};

// add default profile pic

module.exports.saveImage = function(image, email) {
  return db.query('UPDATE users SET profilepic = $1 Where email = $2 RETURNING profilepic', [image, email]).then(function(results) {
    results.rows.forEach(function(row) {
      row.profilepic = config.s3Url + row.profilepic;
    })
    return results.rows[0];
  });
};

module.exports.saveBio = function(bio, email) {
  return db.query('UPDATE users SET bio = $1 Where email = $2 RETURNING bio', [bio, email]).then(function(results) {
    return results.rows[0];
  });
};

module.exports.newFriendRequest = function (senderId, recieverId, status) {
  return db.query(`INSERT INTO friend_statuses (sender_id, reciever_id, status) VALUES ($1, $2, $3)`, [senderId || null, recieverId || null, status || null]).then(function() {
    console.log('new friend request created');
  });
}

module.exports.updateFriendRequest = function (status, senderId, recieverId) {
  return db.query(`UPDATE friend_statuses SET status = $1  WHERE sender_id = $2 AND reciever_id = $3 OR sender_id = $3 AND reciever_id = $2`, [status || null, senderId || null, recieverId || null]).then(function() {
    console.log('friend request updated');
  });
}


module.exports.deleteFriendRequest = function (senderId, recieverId) {
  return db.query(`DELETE FROM friend_statuses WHERE sender_id = $1 AND reciever_id = $2 OR sender_id = $2 AND reciever_id = $1`, [senderId || null, recieverId || null]).then(function() {
    console.log('friend request deleted');
  });
}
