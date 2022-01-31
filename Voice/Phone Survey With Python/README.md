# Overview

This code will show you how you can use the very simple google sheets API instead of a database to store the results of a phone survey designed in Python. In this demo, we will show how it could be used to create a COVID19 health survey that will gather and append the call SID, from number, to number, and the answers to each question to our google sheet. Before we review and explain the code needed for this task, we first need to set up our Google Sheet as well as the Google Cloud Platform. Don't worry, it's easier than you think!

# What do I need to run this code?
Find the full code on Github [here](https://github.com/signalwire/signalwire-guides/tree/master/code/python_phone_survey)
You will need the [SignalWire Python SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python) as well as [Flask](https://flask.palletsprojects.com/en/2.0.x/installation/#install-flask) to handle the web framework. [gspread](https://docs.gspread.org/en/latest/), and
[oauth2client](https://pypi.org/project/oauth2client/) are all a part of our google sheets integration.

Additionally you will need a signalwire account which you can create [here](https://m.signalwire.com/signups/new?s=1). You will also need your SignalWire API credentials which you can find in the `API` tab of your SignalWire dashboard. For more information on navigating your SignalWire space check [here](https://developer.signalwire.com/apis/docs/navigating-your-space).

# How to run this application

## Run this application natively
To run the application, execute export FLASK_APP=app.py then run flask run.

You can use this application as both an inbound or outbound survey. To use this script as an inbound survey, expose it to the web (through a server or SSH tunnel) and use it as a webhook for handling incoming calls under phone number settings. For this script, you would use the server url and the `/survey/welcome` route, like this `http://myServer.fakeserver.com/survey/welcome`.
![Image](https://github.com/signalwire/guides/blob/kguffey-mass-upload-patch-1/Voice/Phone%20Survey%20With%20Python/Image1.png?raw=true)
You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok). 


# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!
