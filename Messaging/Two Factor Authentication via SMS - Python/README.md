# Two Factor Authentication via SMS in Python

## Overview
Two Factor Authentication (2FA) can provide your users effective protection against many security threats that target user passwords and accounts. This application will generate a One-Time Password that is sent to the recipient's phone number via SMS. Application developers can enable two-factor authentication for their users with ease and without making any changes to the already existing application logic or database structure!

<br/>

## What do you need to run this code?

View the full walkthrough on our developer site [here](https://developer.signalwire.com/apis/docs/two-factor-authentication)!

This guide uses the Python SignalWire SDK, for a guide on installation click [here](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python).

You will need a SignalWire phone number as well as your API Credentials (API Token, Space URL, and Project ID) which can all be found in an easily copyable format within the API tab of your SignalWire portal.

<br/>

## How to Run Application

<br/>

### Build and Run on Docker

<br/>


1. Use our pre-built image from Docker Hub 
```
docker pull signalwire/snippets-text-two-factor-auth:python
```


1. Or, Build your own image
```
docker build -t snippets-text-two-factor-auth .
```
2. Run your image
```
docker run --publish 5000:5000 --env-file .env snippets-text-two-factor-auth
```
3. The application will run on port 5000

<br/>

### Build and Run Natively

To run the application, execute `export FLASK_APP=app.py ` then run `flask run`.

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok). 

<br/>

## Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!
