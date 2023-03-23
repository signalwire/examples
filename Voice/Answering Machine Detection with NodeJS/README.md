# Answering Machine Detection with Node.js

Answering Machine Detection (AMD) is a useful tool for high-volume phone systems. It is used to screen outbound calls to determine whether a human or machine (such as an IVR or voicemail system) has answered the call. If a human answers, the call can be connected to a human agent. If a machine is detected, your system may want to end the call or leave a voicemail message. This example will show how to implement AMD using the [Compatibility SDK with Node.js](https://docs.signalwire.com/reference/compatibility-sdks/v3/#compatibility-rest-api-client-libraries-and-sdks-nodejs). While this example automatically dials a test number, you can alter this code to dial numbers in sequence or parallel from a list or CSV file.

## Setup Your Environment

Copy the contents of `env.example` and save them in a new file called `.env`. The first three are standard SignalWire credentials. If you need help finding them, check out our guide to [Navigating Your SignalWire Space](https://developer.signalwire.com/guides/navigating-your-space#api). The `SERVER_URL` is an endpoint for receiving your AMD detection and returning it to your application. Of the three numbers needed for this demo, only the `SW_NUMBER` is required to be a number from your SignalWire Space. Remember to import `dotenv` in your JavaScript to access your variables.

## Run Your Express Server

This example runs an [Express](https://expressjs.com/en/starter/installing.html) server. After your environmental variables are set, you can install dependencies with `npm install` then start the Express server with `npm run start`. If you prefer to use Docker, build the image with `docker build -t nodeamd .` and run it with `docker run --p 3000:3000 --env-file .env nodeamd`.

## Testing with Ngrok

This demo creates a call with the AMD feature enabled, then returns the detection result to a specified URL. We recommend using [Ngrok](https://ngrok.com/download) to provide an HTTPS URL to direct that information back to this demo server. In your Ngrok CLI, run `ngrok http 3000`, where 3000 is the port we set in our Express server. It will return a secure URL you can copy into the environmental variables discussed above.

## Code Walkthrough

Read the full walkthrough in the [Answering Machine Detection](https://developer.signalwire.com/guides/Voice/amd-with-nodejs) guide.
