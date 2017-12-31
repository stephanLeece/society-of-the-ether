const fs = require("fs");
const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:Stephan:postgres@localhost:5432/social');
const config = require('./config.json');

module.exports.getUserByEmail = function(email) {
  return db.query(`SELECT * FROM users WHERE email = $1`, [email]).then(function(results) {
    if (results.rows[0].profilepic) {
      results.rows.forEach(function(row) {

        row.profilepic = config.s3Url + row.profilepic;
      })
    }
    return results.rows[0];
  })
};

module.exports.getUserById = function(id) {
  return db.query(`SELECT * FROM users WHERE id = $1`, [id]).then(function(results) {
    if (!results.rows[0]) {
      return 0
    } else if (results.rows[0].profilepic) {
      results.rows.forEach(function(row) {
        row.profilepic = config.s3Url + row.profilepic;
      })

      return results.rows[0];
    } else {
      return results.rows[0];
    }
  })
};

module.exports.getAllFriends = function(userID) {
  return db.query(`SELECT users.id, fname, lname, profilepic, status
  FROM friend_statuses
  JOIN users
  ON (status = 1 AND reciever_id = $1 AND sender_id = users.id)
  OR (status = 4 AND reciever_id = $1 AND sender_id = users.id)
  OR (status = 4 AND sender_id = $1 AND reciever_id = users.id)`, [userID]).then(function(results) {
    console.log('got em on the db end');
    if (!results.rows[0]) {
      return 0
    } else {
      results.rows.forEach(function(row) {

          row.profilepic = config.s3Url + row.profilepic;

      })
      return results.rows;
    }
  })
}

module.exports.getFriendStatus = function(senderId, recieverId) {
  return db.query(`SELECT * FROM friend_statuses WHERE sender_id = $1 AND reciever_id = $2 OR sender_id = $2 AND reciever_id = $1`, [senderId, recieverId]).then(function(results) {
    if (!results.rows[0]) {
      return 0
    } else {
      return results.rows[0];
    }
  })
}



module.exports.getUsersByIds = function (arrayOfIds) {
      return db.query(`SELECT * FROM users WHERE id = ANY($1)`, [arrayOfIds]).then(function(results) {
        if (!results) {
          return 0
        } else {
          results.rows.forEach(function(row) {

              row.profilepic = config.s3Url + row.profilepic;

          })
          return results.rows;
        }
})
}
