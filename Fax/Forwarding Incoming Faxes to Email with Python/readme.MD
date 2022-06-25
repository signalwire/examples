# Overview 
This short and simple guide will show how you can use the SignalWire Python SDK and the MailGun API in order to forward your incoming SignalWire faxes to email. You can easily bridge this older technology by allowing faxes to be delivered to your inbox with only a few lines of code.

This guide demonstrates how easy it can be to forward your faxes to email using the Mailgun API and SignalWire Python SDK allowing for review of faxes from anywhere. 

# What do I need to run this code?
* [SignalWire Python SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python) 
* [MailGun](https://www.mailgun.com/) 
* [Flask framework](https://flask.palletsprojects.com/en/2.0.x/)

# How to Run the Application 

To run the application, execute `export FLASK_APP=app.py` then run `flask run`. 

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok with SignalWire [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok). 

To use this Script, you need to expose it to the web (either through `ngrok` or by hosting it on a server) and use it as a webhook for handling incoming calls under phone number settings. For example, this is what it looks like if you use an ngrok tunnel to the script. For this script, you would use the given ngrok URL and the `/fax-webhook` route, like this `http://f0032dfdshhdsfkh7.ngrok.io/fax-webhook`

<img width="1242" alt="Screen Shot 2022-06-25 at 1 59 12 PM" src="https://user-images.githubusercontent.com/58792902/175787106-a4a90f22-c439-4954-98c1-10e1fadd5dc6.png">

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!
