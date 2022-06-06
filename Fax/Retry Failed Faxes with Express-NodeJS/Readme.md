# Overview

This is a simple guide using the SignalWire NodeJS SDK and Express to create an application that can send faxes, detected failed faxes with status callbacks, and perform one retry.

# What do I need to run this code?

View the full code on our Github [here](https://github.com/signalwire/signalwire-guides/tree/master/code/fax_retries). \
You will also need the SignalWire NodeJS SDK [here](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#nodejs) \
You will also need to install the NodeJS Express Web Framework [here](https://expressjs.com/) \
For demonstration and testing you may also need ngrok [here](https://www.npmjs.com/package/ngrok) 

# How to run this application

## Run natively
By default you can run `node app.js` in your terminal and express and ngrok will run on port 3000.\
Once ngrok spins up it should log the ngrok tunnel url to your console.\
To send a test fax navigate to the `ngrokurl/quicksend`. This will return a fax SID that you can check in your Signalwire Dashboard.

# Code Walkthrough
This repository will inclue the `app.js` and accompanying `package.json` and `package-lock.json` files.\
Additionally, this repository will include an `example.env` file that you can copy and save with your own credentials as `.env`

## Environment File Setup
Save this file as `.env` after populating it withy our own data
```text
# This is the full name of your SignalWire Space. e.g.: example.signalwire.com
SIGNALWIRE_SPACE_URL=

# Your Project ID - you can find it on the `API` page in your Dashboard.
SIGNALWIRE_PROJECT_ID=

# Your API token - you can generate one on the `API` page in your Dashboard
SIGNALWIRE_API_TOKEN=

# The phone number you'll be using for this Snippet. Must include the `+1` ex. `+11231231234`
SIGNALWIRE_FROMNUMBER=+1<10dlc number>
SIGNALWIRE_TONUMBER=+1<10dlc number>

# If you have an Ngrok account you can include your auth token here.
NGROKTOKEN=

#If hosting this app, enter the host domain here and remove the ngrok tunnel
DOMAIN = 
```

## App.JS set up
First we will need to require our Express, Ngrok, and Rest Client packages. Here we will also assign our Environment Variables.

```javascript
const ngrok = require('ngrok');
const express = require("express");
const { RestClient } = require('@signalwire/node')

let DOMAIN = ""
const FROM_NUMBER = process.env.SIGNALWIRE_FROMNUMBER;
const TO_NUMBER = process.env.SIGNALWIRE_TONUMBER;
const SIGNALWIRE_PROJECT = process.env.SIGNALWIRE_PROJECT_ID; 
const SIGNALWIRE_TOKEN = process.env.SIGNALWIRE_API_TOKEN; 
const SIGNALWIRE_SPACE = process.env.SIGNALWIRE_SPACE_URL; 
```

## SendFax Function
This function will be what sends our faxes. It will accept a `number` that will be the number we send the fax, and a `querystring`. \
Next the function creates our Rest Client, sends a new fax, and sets the `statuscallback` using our `formaturl` function.
Finally we will log the fax.sid to our console, and return it to the client.

```javascript
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
```

## App Route: QuickSend
This route is a very swift way of creating a test fax. It will call our `sendFaxTo()` function and pass our `TO_NUMBER` environment variable.

```javascript
app.get("/quicksend", async (req, res, next) => {
  sid = await sendFaxTo(TO_NUMBER)
  res.send(sid);
});
```

## App Route: Callback
This route handles our status callbacks. If a fax fails we will re-call our sendFaxTo this time passing a querystring. Any faxes that have already been retried once will not be retried again.
```javascript
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

```

## Ngrok Function
This function starts our ngrok tunnel on port 3000, logs the url to our console, and sets our DOMAIN to the url. Comment/delete this out and set DOMAIN to your app's host DOMAIN in production.
```javascript
(async function() {
  const url = await ngrok.connect(3000);
  console.log(url)
  DOMAIN = url
})();
```
## Formaturl function
This function is how we will append actions and querystrings to our domain URLS. This is primarily used when creating a statuscallback url for our `sendFaxTo()` method
```javascript
function formatUrl(action, querystring = '') {
  return DOMAIN + "/" + action + querystring;
}
```
## App.Listen
Points our app to port 3000, this port should match the port that we launch ngrok to.
```javascript
app.listen(process.env.PORT || 3000, () => {
 console.log("Server running on port 3000");
});
```

## Wrap Up
This guide is a great way to get an understanding of how SignalWire's API can be used to send out faxes and properly make use of statuscallbacks to detect and retry failed faxes.

### Resources
View the full code on our Github [here](https://github.com/signalwire/signalwire-guides/tree/master/code/fax_retries). \
You will also need the SignalWire NodeJS SDK [here](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#nodejs) \
You will also need to install the NodeJS Express Web Framework [here](https://expressjs.com/) \
For demonstration and testing you may also need ngrok [here](https://www.npmjs.com/package/ngrok)

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!