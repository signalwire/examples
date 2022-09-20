const express = require("express");
const { RestClient } = require('@signalwire/node')
const ngrok = require('ngrok');
(async function() {
  const url = await ngrok.connect();
  console.log(url + "/dialer")
})();

function formatUrl(action, querystring = '') {
  return "/" + action + querystring;
}

function respondAndLog(res, response) {
  console.log(response.toString());
  res.send(response.toString());
}

// Starting the app
const app = express();
app.use(express.urlencoded());

app.listen(process.env.PORT || 80, () => {
 console.log("Server running on port 80");
});

// App routes
app.post("/dialer", (req, res, next) => {
    console.log(req.body);
    let response = new RestClient.LaML.VoiceResponse();
    dial = response.dial({timeout: 20, action: formatUrl('voicemail')});
    dial.sip("sip:SIP_ENDPOINT_GOES_HERE");
    console.log(req.body);
  if (req.body.DialCallStatus != "completed") {
      // it means the call was not answered
      dial = response.dial({timeout: 20, action: formatUrl('hangup')});
  }
  respondAndLog(res, response);
});

app.post("/voicemail", (req, res, next) => {
    let response = new RestClient.LaML.VoiceResponse();
    if (req.body.DialCallStatus != "completed") {
    // it means the call was not answered
    response.say("I am currently unavailable, please leave a message.")
    response.record({transcribe: true, action: 'hangup'})
  }
  respondAndLog(res, response);
 });

  app.post("/hangup", (req, res, next) => {
      let response = new RestClient.LaML.VoiceResponse();
      respondAndLog(res, response);
});
