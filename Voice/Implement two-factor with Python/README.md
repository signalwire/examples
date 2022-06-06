# Overview
By adding 2FA to your application, you can provide your users effective protection against many security threats that target user passwords and accounts. It will generate a One-Time Password to their phone number via voice call. Application developers can enable two-factor authentication for their users with ease and without making any changes to the already existing application logic or database structure! This guide uses the [Python SignalWire SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python) to show an example of how that can be done!

# What do I need to run this code?
Find the full code on Github [here](https://github.com/signalwire/snippets-voice-2-factor-auth)

You will need a signalwire account which you can create [here](https://m.signalwire.com/signups/new?s=1). You will also need your SignalWire API credentials which you can find in the `API` tab of your SignalWire dashboard. For more information on navigating your SignalWire space check [here](https://developer.signalwire.com/apis/docs/navigating-your-space).

Additionally you will need the [SignalWire Python SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python), the [Requests](https://docs.python-requests.org/en/latest/user/install/#install) module, and [Flask](https://flask.palletsprojects.com/en/2.0.x/installation/#install-flask)

# How to Run this Application

## Setup Your Environment File

1. Copy from example.env and fill in your values
2. Save new file called .env

Your file should look something like this
```
## This is the full name of your SignalWire Space. e.g.: example.signalwire.com
SIGNALWIRE_SPACE=
# Your Project ID - you can find it on the `API` page in your Dashboard.
SIGNALWIRE_PROJECT=
# Your API token - you can generate one on the `API` page in your Dashboard
SIGNALWIRE_TOKEN=
# The phone number you'll be using for this guide. Must include the `+1` , e.g.: +15551234567
SIGNALWIRE_NUMBER=

```
## Build from Docker Hub
```
docker pull signalwire/snippets-voice-two-factor-auth:python
```
(or)

## Build your Own Docker Image
```
docker build -t snippets-voice-two-factor-auth
```
(then)

## Run your image
```
docker run --publish 5000:5000 --env-file .env snippets-voice-two-factor-auth
```

## Build and Run Natively

To run the application, execute export FLASK_APP=app.py then run flask run.

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok). 


# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!
