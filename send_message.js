'use strict';

const request = require('request');

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
    }
};