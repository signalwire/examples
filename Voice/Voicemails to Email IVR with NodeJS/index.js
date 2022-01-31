const express = require("express");
const { RestClient } = require('@signalwire/node')

// get environment variables ////
const PRIMARY_SALES = process.env.PRIMARY_SALES; // phone number for option 1
const SECONDARY_SALES = process.env.SECONDARY_SALES; // secondary phone number for option 1
const RECRUITERS_GROUP = process.env.RECRUITERS_GROUP; // comma separated list of numbers for option 2 (eg. +15556677888,+15559998877)
const ACCOUNTING_GROUP = process.env.ACCOUNTING_GROUP// phone number for option 4;
const JOBS_EMAIL = process.env.JOBS_EMAIL; // email for voicemail option 2
const ACCOUNT_EMAIL = process.env.ACCOUNT_EMAIL; // email for voicemail option 4

const EMAIL_FROM = process.env.EMAIL_FROM || 'SignalWire Sample App <me@samples.mailgun.org>'

// const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN; // get this from your Mailgun account
// var mg = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: MAILGUN_DOMAIN});

var RECORDING_DB = {};


// methods should be in a different file in production ////
function formatUrl(action, querystring = '') {
  return "/" + action + querystring;
}

function respondAndLog(res, response) {
  console.log(response.toString());
  res.send(response.toString());
}

function emailTranscription(email, recording, transcription, number) {
  var date = new Date().toISOString();

  const data = {
    from: EMAIL_FROM,
    to: email,
    subject: 'Voicemail from ' + number,
    text: "At " + date + " you received a call from " + number + "\nRecording: " + recording + "\nTranscription: " + transcription
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

// app startup ////
var app = express();
app.use(express.urlencoded());

app.listen(process.env.PORT || 3000, () => {
 console.log("Server running on port 3000");
});

// app routes ////
app.get("/", (req, res, next) => {
  res.send("Sample IVR")
});

app.post("/entry", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  gather = response.gather({ timeout: 5, numDigits: 1, action: formatUrl('mainmenu') })
  gather.say("Hello! Press 1 for sales, 2 for recruiting or 4 for accounting.")

  respondAndLog(res, response);
 });

app.post("/mainmenu", (req, res, next) => {
  console.log(req.body);
  var response = new RestClient.LaML.VoiceResponse();

  switch (req.body.Digits) {
    case "2":
      dial = response.dial({timeout: 20, action: formatUrl('voicemail', "?Email=" + JOBS_EMAIL + "&Message=Recruiting")});
      var recruiters = RECRUITERS_GROUP.split(',')
      // this makes it so the recruiters are dialed all at the same time, first one to pick up wins
      recruiters.forEach(function(item) {
        dial.number(item);
      });
      break;
    case "4":
      dial = response.dial({timeout: 20, action: formatUrl('voicemail', "?Email=" + ACCOUNT_EMAIL + "&Message=Accounting")});
      dial.number(ACCOUNTING_GROUP);
      break;
    default:
      dial = response.dial({timeout: 20, action: formatUrl('primarysalesdial')});
      dial.number(PRIMARY_SALES);
  }
  
  respondAndLog(res, response);
});

app.post("/primarysalesdial", (req, res, next) => {
  console.log(req.body);
  var response = new RestClient.LaML.VoiceResponse();
  if (req.body.DialCallStatus != "completed") {
    // it means the call was not answered
    dial = response.dial({timeout: 20, action: formatUrl('hangup')});
    dial.number(SECONDARY_SALES);
  }

  respondAndLog(res, response);
});

app.post("/voicemail", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  if (req.body.DialCallStatus != "completed") {
    // it means the call was not answered
    response.say("Our " + req.query.Message + " department is currently unavailable. Please leave a message after the beep.")
    action = formatUrl('voicemailhandler', "?Email=" + req.query.Email)
    response.record({transcribe: true, transcribeCallback: action, action: action })
  }
  respondAndLog(res, response);
 });

app.post("/voicemailhandler", (req, res, next) => {
  console.log(req.body);
  console.log(req.query);
  console.log(RECORDING_DB);
  if (req.body.TranscriptionText) {
    console.log("Got transcription, send email " + req.query.Email + RECORDING_DB[req.body.CallSid] + req.body.TranscriptionText);
    emailTranscription(req.query.Email, RECORDING_DB[req.body.CallSid], req.body.TranscriptionText, req.body.From);
    // avoid leaking memomry
    delete RECORDING_DB[req.body.CallSid]; 
  } else if (req.body.RecordingUrl) {
    console.log('stash recording for later');
    RECORDING_DB[req.body.CallSid] = req.body.RecordingUrl
  }

  var response = new RestClient.LaML.VoiceResponse();
  respondAndLog(res, response);
});

app.post("/hangup", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  respondAndLog(res, response);
});