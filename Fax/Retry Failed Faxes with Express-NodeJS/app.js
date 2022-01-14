// require ngrok, express, and our SignalWire client
const ngrok = require('ngrok');
const express = require("express");
const { RestClient } = require('@signalwire/node')

//Set some environment variables, Domain will be set to our ngrok domain for testing, but would be changed to this app's host domain
let DOMAIN = ""
const FROM_NUMBER = process.env.SIGNALWIRE_FROMNUMBER;
const TO_NUMBER = process.env.SIGNALWIRE_TONUMBER; // the number faxes come from. Must be from you SW account
const SIGNALWIRE_PROJECT = process.env.SIGNALWIRE_PROJECT_ID; // Project ID from your SW account
const SIGNALWIRE_TOKEN = process.env.SIGNALWIRE_API_TOKEN; // Project token from your SW account
const SIGNALWIRE_SPACE = process.env.SIGNALWIRE_SPACE_URL; // Space name from your SW account

// methods should be in a different file in production ////
function respondAndLog(res, response) {
  console.log(response.toString());
  res.send(response.toString());
}
// Sends a dummy fax using our environment variables, and sets a status callback
async function sendFaxTo(number, querystring = '') {
  const client = new RestClient(SIGNALWIRE_PROJECT, SIGNALWIRE_TOKEN, { signalwireSpaceUrl: SIGNALWIRE_SPACE})
  const fax = await client.fax.faxes.create({
    from: FROM_NUMBER,
    to: number,
    mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    statusCallback: formatUrl('callback', querystring)
  });
  console.log('Done', fax.sid)
  return fax.sid
}
// app startup ////
var app = express();
app.use(express.urlencoded({ extended: true }));
// app routes ////

app.get("/status", (req, res, next) => {
  res.send("Sample Faxing")
});

app.post("/send", async (req, res, next) => {
  console.log(req.body);
  if (req.body.number) {
    console.log('sending +1' + req.body.number)
    sid = await sendFaxTo("+1" + req.body.number)
    res.send(sid);
  } else {
    res.send('no number specified');
  }
});

//will send our text fax without any arguments required <- great for testing.
app.get("/quicksend", async (req, res, next) => {
  sid = await sendFaxTo(TO_NUMBER)
  res.send(sid);
});

// serves as our dummy callback url. will try once, then append ?retry=1 to prevent repetitive retries.
app.post("/callback", async (req, res, next) => {
  console.log(req.body);

  if (req.body.FaxStatus == 'failed') {
    // retry if we haven't retried already
    if (req.query.retry) {
      console.log('no retry');
    } else {
      console.log('retrying');
      await sendFaxTo(req.body.To, '?retry=1')
    }
  }

  var response = new RestClient.LaML.VoiceResponse();
  respondAndLog(res, response);
});

//// runs the ngrok tunnel on port 3000 and sets our DOMAIN to this url
(async function() {
  const url = await ngrok.connect(3000);
  console.log(url)
  DOMAIN = url
})();

// formats any action urls, primarily our callback url with the appropriate querystring
function formatUrl(action, querystring = '') {
  return DOMAIN + "/" + action + querystring;
}

//points our express app to port 3000 (same as ngrok tunnel)
app.listen(process.env.PORT || 3000, () => {
 console.log("Server running on port 3000");
});