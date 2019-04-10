// Dependencies
const express = require("express");
// const bodyParser = require('body-parser')
const http = require('http');
var path = require("path");
require('dotenv').config()

// Initialize Express
const app = express();
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Creds
const accountSid = "ACb9b51d3506052f5753d241c17b5c1ddb";
const authToken = "a0d77a5916471b90fa753b200c861770";

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// Default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));;
});

app.post('/', (req, res) => {

  let newPhone = req.body;
  let theNumber = newPhone.number
  console.log("FINALLLLLL", theNumber)
  res.json(theNumber);

  client.messages
    .create({
        body: 'Pick a color: Red, Blue, Green',
        from: '+19292055493',
        to: '+1' + theNumber
    })
    .then(message => console.log(message.sid));
});

// Receive Message
  app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    if (req.body.Body === "Red") {
      twiml.message('Color Red!');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    } else if (req.body.Body === "Blue") {
      twiml.message('Color Blue!');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    } else if (req.body.Body === "Green") {
      twiml.message('Color Green!');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    }
  
  });
  

  const PORT = process.env.PORT || 1337;

  http.createServer(app).listen(PORT, () => {
    console.log('Express server listening on port 1337');
  });
