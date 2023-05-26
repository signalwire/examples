# Using SignalWire Conversational AI with Node.js

Artificial Intelligence platforms are increasingly popular and constantly evolving tools that you can leverage when building a Voice application. SignalWire Conversational AI, currently integrated with Open AI, was developed to simulate natural conversations. An AI agent allows businesses to automate routine tasks, handle high volumes of inquiries, provide instant support 24/7, and offer consistent and accurate information to customers. This example will implement a conversational AI agent with the [Compatibility SDK with Node.js](https://docs.signalwire.com/reference/compatibility-sdks/v3/#compatibility-rest-api-client-libraries-and-sdks-nodejs). Clone this repo to start testing and adapting SignalWire Conversational AI to meet your needs.

## Setup Your Environment

Copy the contents of `env.example` and save them in a new file called `.env`. Fill in your SignalWire credentials. If you need help finding them, check out our guide to [Navigating Your SignalWire Space](https://developer.signalwire.com/guides/navigating-your-space#api). The Compatibility SDK will pull these environmental variables from the `.env` file without any import statement as long as the `.env` file is in the same parent directory.

## Run Your Express Server

This example serves our webhooks using an [Express](https://expressjs.com/en/starter/installing.html) server. After your environmental variables are set, you can install dependencies with `npm install` then start the Express server with `npm run start`. If you prefer to use Docker, build the image with `docker build -t aiagent .` and run it with `docker run --p 3000:3000 --env-file .env aiagent`.

## Testing with Ngrok

SignalWire requires that your webhooks be publicly accessible for them to be used with our services. So, we recommend using [Ngrok](https://ngrok.com/download) to provide an HTTPS URL for testing. In your Ngrok CLI, run `ngrok http 3000`, where 3000 is the port we set in our Express server. It will return a secure URL you can copy for the next step.

## Configure a Number to Accept Incoming Calls

In your SignalWire Dashboard, you can purchase a phone number and edit its settings to direct calls to the Ngrok URL. The settings for your phone number of choice will look something like this:

![phone number configuration in SignalWire dashboard](../SIP%20Voicemail%20with%20NodeJS/ngrok-webhook-config.png)

With your server and Ngrok running, you should now be able to dial this number and test this example.

## Code Walkthrough

Read the full walkthrough in the [Conversational AI](https://developer.signalwire.com/guides/conversational-ai) guide.
