const http = require('http');
const https = require('https');
const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

// Enviroment Vars
var SIGNALWIRE_SPACE = process.env.SIGNALWIRE_SPACE; 

var CONF_NAME = process.env.CONFERENCE_NAME;
var HOSTNAME = process.env.HOSTNAME;

var INBOUND = process.env.INBOUND_NUMBER;  
var AGENT = process.env.AGENT_NUMBER; 
var SUPERVISOR = process.env.SUPERVISOR_NUMBER; 
var CUSTOMER_NUMBER = "+";

// Do Not Edit
var customerCallSid = "";
var agentCallSid = "";
var supervisorCallSid = "";

var accountSid = process.env.SIGNALWIRE_PROJECT;
var authToken = process.env.SIGNALWIRE_TOKEN;

const {
  RestClient
} = require('@signalwire/compatibility-api')
const client = RestClient(accountSid, authToken, { signalwireSpaceUrl: SIGNALWIRE_SPACE })

const app = express();
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static('build'))

function doRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseBody));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.write(data)
    req.end();
  });
}

async function set_recording_status(resourceType, resourceId, recordingStatus, recordingId) {

  if (recordingStatus === "start") {
    let postData = JSON.stringify({});
    var optionsItem = {
      host: SIGNALWIRE_SPACE,
      port: 443,
      path: '/api/laml/2010-04-01/Accounts/' + accountSid + '/' + resourceType + '/' + resourceId + '/Recordings.json',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64'),
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    var blah = await doRequest(optionsItem, postData);

    console.log("recording status")
    console.log(blah);

  } else if (recordingStatus === "pause" || recordingStatus === "resume") {
    var rStatus = 'pause'
    if (recordingStatus === "pause") {
      rStatus = 'paused';
    } else {
      rStatus = 'in-progress';
    }
    let postData = JSON.stringify({});
      optionsItem = {
      host: SIGNALWIRE_SPACE,
      port: 443,
      path: '/api/laml/2010-04-01/Accounts/' + accountSid + '/' + resourceType + '/' + resourceId + '/Recordings/' + recordingId + '.json?Status=' + rStatus,
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64'),
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    blah = await doRequest(optionsItem, postData);

    console.log('-- recording pause start --')
    console.log('/api/laml/2010-04-01/Accounts/' + accountSid + '/' + resourceType + '/' + resourceId + '/Recordings/' + recordingId + '.json')
    console.log(blah)
    console.log('-- recording pause end --')

  } else if (recordingStatus === "stop") {

    rStatus = 'stopped'
    if (recordingStatus === "stop") {
      rStatus = 'stopped';
    }
    let postData = JSON.stringify({});
    optionsItem = {
      host: SIGNALWIRE_SPACE,
      port: 443,
      path: '/api/laml/2010-04-01/Accounts/' + accountSid + '/' + resourceType + '/' + resourceId + '/Recordings/' + recordingId + '.json?Status=' + rStatus,
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64'),
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    blah = await doRequest(optionsItem, postData);
    console.log('-- recording stopped start --')
    console.log('/api/laml/2010-04-01/Accounts/' + accountSid + '/' + resourceType + '/' + resourceId + '/Recordings/' + recordingId + '.json')
    console.log(blah)
    console.log('-- recording stopped end --')
  }
}

function dial_conference(conferenceName, coachSid = "", muted = false, beep = true, startConferenceOnEnter = true, endConferenceOnExit = false, statusCallbackEvent = "join leave", statusCallback = HOSTNAME + "/conference_event", statusCallbackMethod = "POST") {

  var response = new VoiceResponse()
  response.say("Dialing " + conferenceName + " one moment please...");
  var dial = response.dial();

  if (coachSid.length > 0) {
    console.log("Coach Sid Provided")
    dial.conference({
      muted: muted,
      beep: beep,
      startConferenceOnEnter: startConferenceOnEnter,
      endConferenceOnExit: endConferenceOnExit,
      coach: coachSid,
      statusCallbackEvent: statusCallbackEvent,
      statusCallback: statusCallback,
      statusCallbackMethod: statusCallbackMethod,
    }, conferenceName);

  } else {
    console.log("Coach Sid NOT Provided")
    dial.conference({
      muted: muted,
      beep: beep,
      startConferenceOnEnter: startConferenceOnEnter,
      endConferenceOnExit: endConferenceOnExit,
      statusCallbackEvent: statusCallbackEvent,
      statusCallback: statusCallback,
      statusCallbackMethod: statusCallbackMethod,
    }, conferenceName);
  }
  return response
}

app.get('/api/helpers/lookupCaller', async (req, res) => {
  console.log(req.query)

  if(req.query.callSid.length > 0 && req.query.callSid === supervisorCallSid){
    var data = {
      callSid: req.query.callSid,
      number: SUPERVISOR,
      isSupervisor: true,
      isCustomer: false,
      isAgent: false
    }
    res.json(data);
  }else if(req.query.callSid.length > 0 && req.query.callSid === customerCallSid){
    var data = {
      callSid: req.query.callSid,
      number: CUSTOMER_NUMBER,
      isSupervisor: false,
      isCustomer: true,
      isAgent: false
    }
    res.json(data);
  }else if(req.query.callSid.length > 0 && req.query.callSid === agentCallSid){
    var data = {
      callSid: req.query.callSid,
      number: AGENT,
      isSupervisor: false,
      isCustomer: false,
      isAgent: true
    }
    res.json(data);
  }else{
    var data = {
      callSid: req.query.callSid,
      number: "",
      isSupervisor: false,
      isCustomer: false,
      isAgent: false
    }
    res.json(data);
  }

});

app.post('/connect_agent', (req, res) => {

  console.log("Connecting Agent");
  console.log(req.query);

  var response = dial_conference(CONF_NAME, coachSid = "", muted = false, beep = false, startConferenceOnEnter = true, endConferenceOnExit = true);

  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(response.toString());
});

app.post('/connect_customer', (req, res) => {

  console.log("Connecting Customer");
  console.log(req.query);

  var response = dial_conference(CONF_NAME, coachSid = "", muted = false, beep = false, startConferenceOnEnter = false, endConferenceOnExit = true);

  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(response.toString());
});

app.post('/connect_supervisor', (req, res) => {

  console.log("Connecting Supervisor");
  console.log(req.query);

  var response = dial_conference(CONF_NAME, coachSid = req.query.agentCallSid, muted = true, beep = false, startConferenceOnEnter = false);

  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(response.toString());
});

// Inbound Voice Endpoint
app.get('/inbound', (req, res) => {
  console.log(req.query);

  var callSid = req.query.CallSid;

  // For demo store customer call sid in variable
  customerCallSid = callSid;
  CUSTOMER_NUMBER = req.query.From;

  // Connect Agent
  client.calls
    .create({
      url: HOSTNAME + '/connect_agent?conf_name=' + CONF_NAME + "&customerCallSid=" + callSid,
      to: AGENT,
      from: INBOUND
    })
    .then(agentCall => {
      console.log("agent");
      console.log(agentCall.sid)

      // For demo store agent call sid in variable
      agentCallSid = agentCall.sid;
    });

  // Now that agent and supervisor have been requested, add the customer in
  var response = new VoiceResponse();
  response = dial_conference(CONF_NAME, coachSid = "", muted = false, startConferenceOnEnter = true, endConferenceOnExit = true);
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(response.toString());
});

app.post('/conference_event', (req, res) => {

  // Make sure the agent has joined the conference, then dial a supervisor in with coaching
  if (req.body.StatusCallbackEvent == 'participant-join') {
    if (agentCallSid == req.body.CallSid) {
      console.log('agent has joined conference.');
      console.log(req.body);

      //Connect Supervisor
      client.calls
        .create({
          url: HOSTNAME + '/connect_supervisor?conf_name=' + CONF_NAME + "&agentCallSid=" + req.body.CallSid,
          to: SUPERVISOR,
          from: INBOUND
        })
        .then(supervisorCall => {
          console.log("supervisor");
          console.log(supervisorCall.sid)

          // For demo store agent call sid in variable
          supervisorCallSid = supervisorCall.sid;
        });
    }

    if (supervisorCallSid == req.body.CallSid) {
      console.log('supvervisor has joined conference.');
      console.log(req.body);
    }

    if (customerCallSid == req.body.CallSid) {
      console.log('customer has joined conference.');
      console.log(req.body);
    }
  }

  res.sendStatus(200);
});

app.get('/api/recordings/start', (req, res) => {
  console.log(req.query);

  set_recording_status('Calls', req.query.participantId, 'start', '')

  res.sendStatus(200);
});

app.get('/api/recordings/stop', (req, res) => {
  console.log(req.query);

  set_recording_status('Calls', req.query.participantId, 'stop', req.query.recordingSid)

  res.sendStatus(200);
});

app.get('/api/recordings/pause', (req, res) => {
  console.log(req.query);

  set_recording_status('Calls', req.query.participantId, 'pause', req.query.recordingSid)

  res.sendStatus(200);
});

app.get('/api/recordings/resume', (req, res) => {
  console.log(req.query);

  set_recording_status('Calls', req.query.participantId, 'resume', req.query.recordingSid)

  res.sendStatus(200);
});

app.get('/api/recordings/list', async (req, res) => {
  console.log(req.query)

  let postData = JSON.stringify({});
  var optionsItem = {
      host: SIGNALWIRE_SPACE,
      port: 443, 
      path: '/api/laml/2010-04-01/Accounts/' + accountSid +'/Recordings.json?CallSid=' + req.query.participantId,
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64'),
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    var blah = await doRequest(optionsItem, postData);

    console.log('-- recording list start --')
    console.log(blah)
    console.log('-- recording list end --')


  res.json(blah);

});

app.get('/api/recordings', async (req, res) => {
  console.log(req.query)

  let postData = JSON.stringify({});
  var optionsItem = {
      host: SIGNALWIRE_SPACE,
      port: 443,
      path: '/api/laml/2010-04-01/Accounts/' + accountSid + '/Conferences/'+ req.query.conferenceId  +'/Recordings.json',
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64'),
        'Content-Type': 'application/json',
	      'Content-Length': Buffer.byteLength(postData)
      }
    };
    var blah = await doRequest(optionsItem, postData);
    console.log(blah)

  res.json(blah);

});

app.get('/api/participants', async (req, res) => {
  console.log(req.query)

  let postData = JSON.stringify({});
  var optionsItem = {
      host: SIGNALWIRE_SPACE,
      port: 443,
      path: '/api/laml/2010-04-01/Accounts/' + accountSid + '/Conferences/'+ req.query.conferenceId  +'/Participants.json',
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64'),
        'Content-Type': 'application/json',
	      'Content-Length': Buffer.byteLength(postData)
      }
    };
    var blah = await doRequest(optionsItem, postData);
    console.log(blah)

  res.json(blah);

});

/*
curl -X POST https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Conferences/CFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Participants/CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json \
--data-urlencode "Muted=True" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
*/
app.get('/api/conferences/update', async (req, res) => {
  console.log("-- conference update start --")
  console.log(req.query)

  var result = "";
  if(req.query.cmd === "barge"){
    result = await client.conferences(req.query.conferenceId)
        .participants(req.query.participantId)
        .update({muted: false, coaching: false, call_sid_to_coach: ""})
        .then(participant => 
          { 
            console.log("-- barge result start --");
            console.log(result);
            console.log(participant) 
            console.log("-- barge result end --");

            return res.json(participant);
          }
        );
  }

  if(req.query.cmd === "monitor"){
    result = await client.conferences(req.query.conferenceId)
        .participants(req.query.participantId)
        .update({muted: true})
        .then(participant => 
          { 
            console.log("-- monitor result start --");
            console.log(result);
            console.log(participant) 
            console.log("-- monitor result end --");

            return res.json(participant);
          }
        );
  }

  if(req.query.cmd === "coach" && req.query.coachSid.length>0){
    result = await client.conferences(req.query.conferenceId)
        .participants(req.query.participantId)
        .update({muted: false, coaching: true, call_sid_to_coach: req.query.coachSid})
        .then(participant => 
          { 
            console.log("-- coach result start --");
            console.log(result);
            console.log(participant) 
            console.log("-- coach result end --");

            return res.json(participant);
          }
        );
  }
  console.log("-- conference update end --")
  res.send(200);
});

app.get('/api/calls/update', async (req, res) => {
  console.log(req.query)

  client.calls(req.query.callSid)
      .update({method: 'POST', url: 'http://demo.twilio.com/docs/voice.xml'})
      .then(call => console.log(call.to));
  res.send(200);
});

app.get('/api/dashboard', async (req, res) => {
  let postData = JSON.stringify({});
  var optionsItem = {
      host: SIGNALWIRE_SPACE,
      port: 443,
      path: '/api/laml/2010-04-01/Accounts/' + accountSid + '/Conferences.json',
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64'),
        'Status': 'completed',
	      'FriendlyName': CONF_NAME,
	      'PageSize': 20,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    var blah = await doRequest(optionsItem, postData);
    console.log(blah)

  res.json(blah);
});

http.createServer(app).listen(5000, () => {
  console.log('Express server listening on port 5000');
});
