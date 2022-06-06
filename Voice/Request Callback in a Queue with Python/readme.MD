# Overview 
In a past [blog](https://signalwire.com/blogs/industry/best-phone-menu-practices), we talked about the importance of having a concise phone menu so that customers don't have to wait through your IVR in order to resolve an issue. But what happens if a lot of customers call at once, making long hold and wait times that may make your customers aggravated as they stay on the line for extended periods of time? Have your customers keep their sanity while avoiding long hold times by offering a callback option.  Using the [SignalWire Python SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python), customers can call and request a call back by pressing a digit, or they can text message the number and request a call back when the next agent is available.

This code runs by navigating through a series of endpoints that accepts incoming text messages from your SignalWire Space in order to place and handle callers in a callback queue. Once the call-back request is processed, the agent will be connected back to the caller. 

If you have a busy call center, your customers might grow frustrated having to wait on the phone for their turn to speak to an agent. You can make their day much easier by allowing them the option to receive a call back instead of waiting on the phone the whole time! This guide shows how easy it is to offer customers a chance to request a call back when they are next in line. 

# What do I need to run this application?
You will need the [Flask](https://pypi.org/project/Flask/) framework and the SignalWire [Python SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python) downloaded.

You will need a SignalWire phone number as well as your API Credentials (**API Token**, **Space URL**, and **Project ID**) which can all be found in an easily copyable format within the **API** tab of your SignalWire portal. 

# Running the application 
## Build and Run on Docker


1. Use our pre-built image from Docker Hub 
```

docker pull signalwire/snippets-queue-request-callback:python
```
(or build your own image)

1. Build your image
```
docker build -t snippets-queue-request-callback .
```
2. Run your image
```
docker run --publish 5000:5000 --env-file .env snippets-queue-request-callback
```
3. The application will run on port 5000

## Build and Run Natively

To run the application, execute export FLASK_APP=app.py then run flask run.

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok).


# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!