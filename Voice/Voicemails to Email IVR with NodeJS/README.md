# Overview
This advanced example builds an application that implements a simple phone tree IVR with a few interesting features, including: 

- Parallel dialing to multiple phone numbers
- Recording a voicemail and using a dynamic greeting
- Transcribing voicemail and sending both the text and the recording via email

# What do you need to run this code? 
Check out the full code on our Github Repository [here](https://github.com/signalwire/signalwire-guides/tree/master/code/node_ivr)

You will need the [SignalWire Node.JS SDK](https://docs.signalwire.com/topics/laml-api/#laml-rest-api-client-libraries-and-sdks-nodejs), and your SignalWire Credentials. You can find these by logging into your SignalWire space and navigating to the API tab. For more information on navigating your SignalWire space check [here](https://developer.signalwire.com/apis/docs/navigating-your-space)

The application also uses the [Express](https://expressjs.com/en/starter/installing.html) web framework and [Mailgun](https://www.mailgun.com/) to send the emails, and you will need an API key from that service. You could also use any other email API.

# Running the application

## Setup Your Environment File

1. Copy from example.env
2. Save new file called .env
3. Fill in the fields with your own values
```
PRIMARY_SALES=+15557788999
SECONDARY_SALES=+15554433222
RECRUITERS_GROUP=+15556677888,+15559998877
ACCOUNTING_GROUP=+15554455777
JOBS_EMAIL=jobs@yourdomain.com
ACCOUNT_EMAIL=accounts@yourdomain.com

EMAIL_FROM=me@samples.mailgun.org
MAILGUN_DOMAIN=your-Mailgun-domain
MAILGUN_API_KEY=your-Mailgun-api-key
```

## Build and run via Docker

It is simpler to run the application via Docker, by first building the image with `docker build -t nodeivr .` followed by `docker run -it --rm -p 3000:3000 --name nodeivr --env-file .env nodeivr`.

## Build and Run locally

If you are running the application locally, first load the `.env` file with `set -o allexport; source .env; set +o allexport`, then run `npm install` followed by `npm start`.

# Step by Step Code Walkthrough
In the [Github Repo](https://github.com/signalwire/signalwire-guides/tree/master/code/node_ivr) there are 6 files. We are mainly concerned with the `env.example` which we will use to set up our `.env` file, and `index.js` where the application lives.

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!
