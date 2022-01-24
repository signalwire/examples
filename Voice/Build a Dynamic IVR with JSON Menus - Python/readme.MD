# Overview 
This code will show you how you can use a JSON-defined menu in order to easily create an IVR Phone System with Python & Flask. 
We will be using the SignalWire Team as an example, but you can easily change the verbiage to fit your company's needs instead. 
Once you have modified this script to fit your company and point to the correct agents/departments, you only need to expose 
the script to the public and attach it as a webhook for handling inbound calls to one of your SignalWire DIDs. 

Almost every business that has a phone number to dial utilizes some type of IVR to help their customers navigate to the correct resource depending on their needs. The beauty of this application is that with the implementation of JSON menus, changing the script of the IVR for your specific business needs is a breeze!

# What do I need to run this code?

You will need the Flask framework and the SignalWire [Python SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python) downloaded.

You will need a SignalWire phone number as well as your API Credentials (**API Token**, **Space URL**, and **Project ID**) which can all be found in an easily copyable format within the **API** tab of your SignalWire portal. 

# How to Run Application

To run the application, execute `export FLASK_APP=app.py` then run `flask run`

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok).

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!