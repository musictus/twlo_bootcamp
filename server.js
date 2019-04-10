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
const accountSid = "ACb9b51d3506052f5753d241c17b5c1ddb";
const authToken = "a0d77a5916471b90fa753b200c861770";

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

let phoneNumber = ""

app.post('/', (req, res) => {

  var newPhone = req.body;
  console.log(newPhone);
  res.json(newPhone);

  client.messages
    .create({
        body: 'Pick your available time',
        from: '+1' + newPhone,
        to: phoneNumber
    })
    .then(message => console.log(message.sid));
});

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
