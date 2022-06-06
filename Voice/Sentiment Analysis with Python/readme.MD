# Overview 

This guide will show you how to easily identify the sentiment and emotion of a call. This is good for POST analysis or with some simple modification, it can be used in real-time to route the caller actively. 

In this guide, we will accept calls and send audio to the NLP service allowing for a web application to monitor sentiment in real-time. **Sentiment is a score from 0 to 1 that identifies the caller's emotion.**  You point a SignalWire phone number to the `/voice_entry` endpoint, and it will assign a score and read it back to you. Once a call has three consecutive negative results, the API dispatches an SMS to a supervisor for assistance.

Keep in mind this is an example. However, depending on the sentiment score, you can route the call however your business sees fit, send follow-up surveys for customer satisfaction purposes, begin call recordings, and so much more. The possibilities are truly endless.

Sentiment analysis is a powerful natural language processing tool that can help you get the real sentiment of your callers and make decisions based on what you find out. It can easily be used as a post-processing tool or in real-time to determine the best way to respond to the customer. 

# What do I need to run this application? 

View the full code on our Github [here](https://github.com/signalwire/snippets-sentiment-analysis)!

You will need the Flask framework and the SignalWire [Python SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python) downloaded.

You will also need your API key from [Microsoft Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/) in order to use their sentiment analysis. 

You will need a SignalWire phone number as well as your API Credentials (**API Token**, **Space URL**, and **Project ID**) which can all be found in an easily copyable format within the **API** tab of your SignalWire portal. 

# Running the Application 
## Build and Run on Docker

1. Use our pre-built image from Docker Hub 
```
docker pull signalwire/snippets-sentiment-analysis:python
```
(or build your own image)

1. Build your image
```
docker build -t snippets-sentiment-analysis .
```
2. Run your image
```
docker run --publish 5000:5000 --env-file .env snippets-sentiment-analysis
```
3. The application will run on port 5000

## Build and Run Natively

To run the application, execute export FLASK_APP=app.py then run flask run.

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok). 

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!