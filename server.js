// Dependencies
const express = require("express");
const bodyParser = require('body-parser')
const http = require('http');
var path = require("path");
require('dotenv').config()

// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

// Creds
const accountSid = process.env.SID;
const authToken = process.env.TOKEN;

// const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;


// Send Message
// function sendMessage() {
//     client.messages
//     .create({
//         body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//         from: '+19292055493',
//         to: '+16468317059'
//     })
//     .then(message => console.log(message.sid));
// }

// Default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));;
});

// Receive Message
  app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    if (req.body.Body === "Test") {
      twiml.message('Stop testing!');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    } else if (req.body.Body === "Food") {
      twiml.message('Eat some more!');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    }
  
  });
  

  const PORT = process.env.PORT || 1337;

  http.createServer(app).listen(PORT, () => {
    console.log('Express server listening on port 1337');
  });
