# Overview 
This guide will show you how to create a phrase-based subscription service using SignalWire and Python. The application will demonstrate how you can easily create and maintain multiple campaigns as well as their associated subscribers.  The list administrator can broadcast to specific campaigns and is notified of new subscribers and removal requests via email. If you reply with stop or unsubscribe, the number will be placed in a black list.

If you're running messaging campaigns as a business, one of the most important rules to follow is respecting the opt-ins or opt-outs from customers. This guide has shown one possible way to implement the process of text subscription as well as the maintenance of subscriber lists. 

# What do you need to run this code? 

You will need the [Python SignalWire SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python) and the [MailGun API](https://www.mailgun.com/) to send an email.

You will need a SignalWire phone number as well as your API Credentials (**API Token**, **Space URL**, and **Project ID**) which can all be found in an easily copyable format within the **API** tab of your SignalWire portal. 

# How to Run Application 

## Build and Run on Docker

1. Use our pre-built image from Docker Hub 
```
docker pull signalwire/snippets-text-subscription:python
```
(or build your own image)

1. Build your image
```
docker build -t snippets-text-subscription .
```
2. Run your image
```
docker run --publish 5000:5000 --env-file .env snippets-text-subscription
```
3. The application will run on port 5000

## Build and Run Natively

To run the application, execute `export FLASK_APP=app.py` then run `flask run`.

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok). 

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!