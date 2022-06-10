# Two Factor Authentication via SMS in Node.js

## Overview
Two Factor Authentication (2FA) can provide your users effective protection against many security threats that target user passwords and accounts. This application will generate a one-time password that is sent to the recipient's phone number via SMS. Application developers can enable two-factor authentication for their users with ease and without making any changes to the already existing application logic or database structure!


## Required Resources

View the [full walkthrough](https://developer.signalwire.com/apis/docs/two-factor-authentication) on our developer portal!

This guide uses SignalWire's [RELAY Realtime SDK](https://developer.signalwire.com/client-sdk/reference/rt-exports).

You will need a SignalWire phone number as well as your API Credentials (API Token, Space URL, and Project ID) which can all be found in an easily copyable format within the API tab of your SignalWire portal.


## How to Run Application

### Build and Run on Docker

Build your own image with `docker build -t snippets-text-two-factor-auth .`

Run your image with `docker run --publish 5000:5000 --env-file .env snippets-text-two-factor-auth`

The application will run on port 5000

<br/>

### Build and Run Natively



<br/>

## Sign Up Here

If you would like to test this example out, you can [create a SignalWire account and space](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire-community.slack.com/) or create a Support ticket if you need guidance!
