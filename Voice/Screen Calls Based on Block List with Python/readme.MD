# Overview 
This guide implements a call screening system based on the concept of a blocklist containing offending numbers. When a call comes in, the From number will be cross-checked with the block list to see if it is one of the blocked numbers. If so, the call will hang up. If the number is not in the block list, the call flow moves on to the next segment. 

In this case, I have redirected to an XML Bin. However, depending on your needs, this can point at an XML bin, another webhook, or another part of the code within the same document. As you can see below, it is very simple to implement such a call flow with SignalWire and SignalWire Compatible XML.

In the current ecosystem of voice calling, business owners run the risk of facing incoming spam calls, robocalls, or people who are generally trying to take advantage of resources. Implementing a blocklist (or database) to maintain numbers that should be "blacklisted" is a very effective way of reducing the cost impact caused by these spammers and this guide shows an easy way to do that!

# What do I need to run this code? 


You will need the [Python SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python) and [Flask](https://pypi.org/project/Flask/) framework to run this code. 

You will need a SignalWire phone number as well as your API Credentials (**API Token**, **Space URL**, and **Project ID**) which can all be found in an easily copyable format within the **API** tab of your SignalWire portal. 

# Running the application 
To install prerequisites, run `pip install -r requirements.txt`. Using a virtualenv is recommended.

To run the application, execute `export FLASK_APP=python_call_screening.py` then run `flask run`.

You may need to use an SSH tunnel for testing this code – we recommend [ngrok](https://ngrok.com/). After starting the tunnel, you can use the URL you receive from `ngrok` in your webhook configuration for your phone number.


# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!