'use strict';

const request = require('request');
const db = require('./db');

module.exports = {
    textMessage: function (sender, msg) {
        let messageData = {text: msg};
        this.sendMessage(sender, messageData);
    },

    sendMessage: function (sender, messageData) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: process.env.ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData,
            }
        }, function (error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        });
    },

    generateMenu: function(sender) {
      let messageData = {
        recipient: {
          id: sender
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [{
                title: "DHL Bot Menu",
                subtitle: "Welcome to DHL Bot Service",
                item_url: "http://www.dhl.com/en.html",
                image_url: "http://logok.org/wp-content/uploads/2014/05/DHL-logo.png",
                buttons: [{
                  type: "web_url",
                  url: "http://www.dhl.com/en.html",
                  title: "Open DHL Homepage"
                }, {
                  type: "postback",
                  title: "Check Package Status",
                  payload: JSON.stringify({state: 'A1'}),
                }],
              }]
            }
          }
        }
      };
      request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: process.env.ACCESS_TOKEN},
          method: 'POST',
          json: messageData
      }, function (error, response, body) {
          if (error) {
              console.log('Error sending messages: ', error)
          } else if (response.body.error) {
              console.log('Error: ', response.body.error)
          }
      });
    },

    replyPayload: function(sender, payload) {
      // Parse payload strings to json
      let jsonPayload = JSON.parse(payload);

      // Replying state A1
      if (jsonPayload.state === "A1"){
        db.storeState(sender, "A2");
        this.textMessage(sender, "Provide your receipt number here");
      }
    }
};
