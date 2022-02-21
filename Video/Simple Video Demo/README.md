# Simple Video Demo with SignalWire Video API

SignalWire's Video API allows you to host real-time video calls and conferences on your website or app.

This example uses the [SignalWire Video API](https://developer.signalwire.com/apis/reference/overview) and the [SignalWire Video SDK for Javascript](https://developer.signalwire.com/client-sdk/docs/getting-started) to create a simple video conferencing application.

📖 [Read the full guide](https://developer.signalwire.com/apis/docs/getting-started-with-the-signalwire-video-api-1)

## Prerequisites

You will need a SignalWire account, and you can sign up [here](https://id.signalwire.com/signup/account/new). From your SignalWire account, you will retrieve your Project ID, your Space URL and an API token which you can generate from the API tab in your dashboard.

If you are looking for more information about using SignalWire, refer to our [Quick Start](https://developer.signalwire.com/apis/docs/signing-up-for-a-space) guides.

## Configuration

To store your SignalWire API credentials, you need to create a file named `.env` at the root of the directory (next to `package.json`). The three project variables you previously noted from your SignalWire account will be stored there in the following format:

```
SIGNALWIRE_PROJECT_ID=<Project ID here>
SIGNALWIRE_API_TOKEN=<Your API token here>
SIGNALWIRE_SPACE_URL=<your space name>.signalwire.com
```

## Running the Application

If you are running the application locally:

 - install the dependencies with `npm install`
 - create a `.env` file and set it up as above
 - start the application with `npm start`

 If you prefer to run the application via Docker, first building the image with `docker build -t videosdk .` Then run `docker run -it --rm -p 4000:4000 --name firstdemo --env-file .env videosdk`.

Either way you choose to run the backend, after starting the application, you can find a test page at `http://localhost:4000`.

## Get started with SignalWire

If you have successfully run this example, you now have a SignalWire account and space. If you created a [new account](https://m.signalwire.com/signups/new?s=1), your account may be made in trial mode, which starts you with a credit of $5.00. You can find more information on the [Trial Mode resource page](https://developer.signalwire.com/apis/docs/trial-mode).

If you want more information about the awesome possibilities with SignalWire, visit our [Developer Home Page](https://developer.signalwire.com/) to see all of our products, guides, and reference material.

Please feel free to reach out to us on our Community Slack or create a Support ticket if you need guidance!