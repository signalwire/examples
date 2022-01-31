# Overview

This application will prompt the caller for a phone number via speech input and connect to the phone number recognized using ASR providing an additional level of accessibility to your users. 

##What do you need to run this code?

View the full code on our Github [here](https://github.com/signalwire/snippets-dial-by-voice)!

Additionally you will need the [SignalWire Python SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python), the [Requests](https://docs.python-requests.org/en/latest/user/install/#install) module, and of course you will need your SignalWire API credentials. You can find these by logging into your SignalWire space and navigating to the API tab. For more information on navigating your SignalWire space check [here](https://developer.signalwire.com/apis/docs/navigating-your-space)

#How to Run the Application

##Run pre-built from Docker Hub
`docker pull signalwire/snippets-call-text-proxy:python`

##Build On Docker
`docker build -t snippets-call-text-proxy`

##Run your Image
`docker run --publish 5000:5000 --env-file .env snippets-call-text-proxy`

##Build and Run Natively
To run the application, execute export FLASK_APP=app.py then run flask run.

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok).

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!