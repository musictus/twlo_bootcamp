// Dependencies
const express = require("express");
const http = require('http');
require('dotenv').config()

// Initialize Express
const app = express();
// Download the helper library from https://www.twilio.com/docs/node/install
const accountSid = process.env.SID;
const authToken = process.env.TOKEN;
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;


// Send Message
function sendMessage() {
    client.messages
    .create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+19292055493',
        to: '+16468317059'
    })
    .then(message => console.log(message.sid));
}


// Receive Message
  app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
  
    twiml.message('The Robots are coming! Head for the hills!');
  
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });
  
  http.createServer(app).listen(1337, () => {
    console.log('Express server listening on port 1337');
  });
