'use strict';

const MongoClient = require('mongodb').MongoClient;
const db_url = require('./env.json').develop.url;
let contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;
    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;
            for(i = 0; i < this.length; i++) {
                var item = this[i];
                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle) > -1;
};

module.exports = {
  storeState: function(userId, state){
    MongoClient.connect(db_url, function(err, db){
      if (err){
        console.log("Database not connected");
        console.log("Error : " + err);
      } else {
        db.createCollection('user', {strict: true}, function(err, collection) {
          if (err){
            console.log("Collection user already exist");
            console.log("Error : " + err);
          } else {
            console.log("Successfully created collection user");
          }
        });
        console.log("Database successfully connected");
        let users = db.collection('user');
        users.find({user_id: userId}).toArray(function(err, result){
          if (err){
            console.log("Error fetching state data");
            console.log("Error : " + err);
          } else {
            if (result.length <= 0) {
              console.log("Data of user " + userId + " not found");
              users.insert({user_id: userId, state: state}, function(err, data){
                if (err){
                  console.log("Error inserting state data");
                  console.log("Error : " + err);
                } else {
                  console.log("State of user " + userId + " successfully inserted");
                  console.log(data);
                }
              });
            } else {
              console.log("Data of user " + userId + " found");
              console.log(result);
              users.update(
                {user_id: userId},
                {$set: {state: state}},
                {w:1},
                function(err, data){
                  if (err){
                    console.log("Error updating state data");
                    console.log("Error : " + err);
                  } else {
                    console.log("State of user " + userId + " successfully updated");
                    console.log(data.result);
                  }
                }
              );
            }
          }
        });
      }
    });
  },
  fetchState: function(userId, callback){
    MongoClient.connect(db_url, function(err, db){
      if (err){
        console.log("Database not connected");
        console.log("Error : " + err);
        callback(null, null);
      } else {
        db.createCollection('user', {strict: true}, function(err, collection) {
          if (err){
            console.log("Collection user already exist");
            console.log("Error : " + err);
          } else {
            console.log("Successfully created collection user");
          }
        });
        console.log("Database successfully connected");
        let users = db.collection('user');
        users.find({user_id: userId}).toArray(function(err, result){
          if (err){
            console.log("Error fetching state data");
            console.log("Error : " + err);
            callback(null, null);
          } else {
            console.log("State of user " + userId + " successfully fetched");
            console.log("User " + userId +  " current state : " + result[0].state);
            if (result.length > 0){
              console.log("State of user " + userId + " has been found");
              callback(null, result[0].state);
            } else {
              console.log("State of user " + userId + " is empty");
              callback(null, null);
            }
          }
        });
      }
    });
  }
};
