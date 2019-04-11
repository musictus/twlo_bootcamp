// Dependencies
const express = require("express");
// const bodyParser = require('body-parser')
const http = require('http');
const axios = require("axios");
const path = require("path");
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
        body: 'Text your stock symbol (i.e. AAPL or aapl)',
        from: '+19292055493',
        to: '+1' + theNumber
    })
    .then(message => console.log(message.sid));
});

// Receive Message
  app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    // const message = twiml.message();
    
    const textResponse = req.body.Body;
    console.log("before: ", textResponse)
    const stock = textResponse.trim().toLowerCase();
    console.log("after: ", stock)
    const url = "https://cloud.iexapis.com/beta/stock/" + stock + "/quote?token=pk_8996522f9079466b8365fb53fa63d9f5"

    axios.get(url).then(
      response => {
        console.log("testing", response.data)
        console.log("testing one", response.data.latestPrice)
        let stockQuotes = response.data.companyName + 
        "\nLatest Price: " + response.data.latestPrice +
        "\nToday's High: " + response.data.high +
        "\nToday's Low: " + response.data.low +
        "\nExtendedPrice: " + response.data.extendedPrice +
        "\n\nMarket Cap: " + response.data.marketCap +
        "\nPE Ratio: " + response.data.peRatio +
        "\n52 Weeks High: " + response.data.week52High +
        "\n52 Weeks Low: " + response.data.week52Low +
        "\nYear to Date Change: " + response.data.ytdChange;
      }
    );

    twiml.message(stockQuotes);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());


    // if (req.body.Body === "Red" || "red") {
    //   // twiml.message('Color Red!');
    //   message.body('Color Red!');
    //   message.media('https://www.colorcombos.com/images/colors/FF0000.png');
    //   res.writeHead(200, {'Content-Type': 'text/xml'});
    //   res.end(twiml.toString());
    // } else if (req.body.Body === "Blue" || "blue") {
    //   // twiml.message('Color Blue!');
    //   message.body('Color Blue!');
    //   message.media('https://www.colorcombos.com/images/colors/336699.png');
    //   res.writeHead(200, {'Content-Type': 'text/xml'});
    //   res.end(twiml.toString());
    // } else if (req.body.Body === "Green" || "green") {
    //   // twiml.message('Color Green!');
    //   message.body('Color Green!');
    //   message.media('https://www.colorcombos.com/images/colors/5BC236.png');
    //   res.writeHead(200, {'Content-Type': 'text/xml'});
    //   res.end(twiml.toString());
    // }
  
  });
  

  const PORT = process.env.PORT || 1337;

  http.createServer(app).listen(PORT, () => {
    console.log('Express server listening on port 1337');
  });
