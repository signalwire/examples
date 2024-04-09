# Using Chat to send SMS messages and make Voice calls

## Overview
Using the SignalWire chat sdk, we explore a simple IVR chat application that offers the user an option to send an SMS message or make a voice call directly from the browser by making use of our Browser SDK and our RELAY Realtime Server SDK   

## What do you need to run this code?

View the full walkthrough on our developer site [here](https://developer.signalwire.com/apis/docs/using-chat-to-send-message-and-initiate-calls#how-to-run-the-application)!

- NodeJS Environment 
- This guide uses the NodeJS SignalWire Realtime-api SDK, for a guide on installation click [here](https://developer2.signalwire.com/sdks/reference/realtime-sdk/realtime-sdk-reference)
- In the project folder there is a `.env.example` file which you can use to create your `.env` file and replace the content with necessary credentials like from your Space

The API also requires that you authenticate yourself using your Project ID, API Token, and Space URL. If you do not know where to find these values, check out our guide to [Navigating your SignalWire Space](https://developer.signalwire.com/apis/docs/navigating-your-space#api)!

## How to Run Application

1. install the dependency present in our `package.json`

```
npm install
```

2. run the application with the below command

```
node index.js
```

if you have `nodemon`

```
nodemon index.js
````


## Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!
