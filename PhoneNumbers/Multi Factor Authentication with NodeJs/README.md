# Overview

This guide will use the Express Framework to create a simple web application that uses the SignalWire MFA API to authenticate a user via sms or voice call.

📖 [Read the full guide](https://developer.signalwire.com/apis/docs/multi-factor-authentication-2)

# What do I need to run this code?

- Basic understanding of the Javascript framework
- A NodeJS Environment
- [Express](https://expressjs.com) to handle the web framework

Additionally, you will need a SignalWire account which you can create [here](https://m.signalwire.com/signups/new?s=1). You will also need your SignalWire API
credentials which you can find in the `API` tab of your SignalWire dashboard. For more information on navigating your SignalWire space check [here](https://developer.signalwire.com/apis/docs/navigating-your-space)

# How to Run Application

The Multi-factor authentication application is built using [Express](https://expressjs.com), ExpressJs is a minimal and flexible Node.js web application framework that provides a robust set of features
for web applications and mobile applications.

Follow the below steps to get started with this guide:

- Clone project
- Run `npm install`
- In the project folder there is a `.env.example` file which you can use to create your `.env` file and replace the content with necessary credentials like we mentioned in the prerequisite section.
- Run the project typing the following command in your terminal `node index.js` or `nodemon index.js` if you have [nodemon](https://www.npmjs.com/package/nodemon) installed

This application has two components `index.js` which is our "server" component, and a `frontend` folders which holds all of our static files like (index.html, css files, e.tc.) which is our client component.

If you want to view the full guide on this topic you can visit our developer portal [here]()

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!