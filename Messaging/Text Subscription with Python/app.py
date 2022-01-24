import os
import requests
import pprint
import json

from signalwire.rest import Client as signalwire_client
from flask import Flask,request

app = Flask(__name__)

# JSON serialization helper
def set_default(obj):
    if isinstance(obj, set):
        return list(obj)
    raise TypeError

# Listen on route '/text_inbound' for inbound text messages on GET/POST requests
@app.route('/text_inbound', methods=['GET', 'POST'])
def text_inbound():

    # Initialize the SignalWire client
    client = signalwire_client(os.environ['SIGNALWIRE_PROJECT'], os.environ['SIGNALWIRE_TOKEN'], signalwire_space_url = os.environ['SIGNALWIRE_SPACE'])

    # Read campaigns from json file
    with open('campaigns.json') as f:
        campaigns = json.load(f)

    # Read Do Not Contact Json
    with open('donotcontact.json') as f:
        donotcontact = json.load(f)

    # Read params passed in by request
    phrase = request.values.get("Body")
    number = request.values.get("From")

    print(donotcontact)
    print(number)

    # If number is on do not contact list, ignore request
    for x in donotcontact['DoNotContact']:
        print(x[0])
        if number == x[0]:
            return "200"

    # Trim the phrase provided
    phrase = phrase.strip()

    # Check phrase for STOP / UNSUBSCRIBE
    if phrase.lower() == "stop" or phrase.lower() == "unsubscribe" or phrase.lower() == "remove":

        # Add number to DoNotContact file
        donotcontact['DoNotContact'].append( { number } )

        # Write updated DoNotContact to file
        with open('donotcontact.json', 'w') as f:
            print(donotcontact)
            json.dump(donotcontact, f, default=set_default)

        # Send receipt of unsubscribe message
        message = client.messages.create(
            from_ = os.environ['SIGNALWIRE_NUMBER'],
            body = "You have been removed from our list.",
            to = number
        )

        # Send email to administrator or your hook logic, unsubscribed
        send_email("Subscriber requested to be removed: \n" + " Number: " + number)

        return "200"

    # Loop through all campaigns for active phrase
    for campaign in campaigns:

        if phrase in campaign["Phrases"]:

            # If the number is in a campaign then they are already subscribed, else add them to the campaign
            for x in campaign['Subscribers']:

                if number == x[0]:

                    # Send already subscribed message
                    message = client.messages.create(
                        from_ = os.environ['SIGNALWIRE_NUMBER'],
                        body = "You are already subscribed to '" + phrase  + "'",
                        to = number
                    )

                else:

                    # Add new number to campaign subscriber list
                    campaign["Subscribers"].append( { number } )

                    # write updated data to file
                    with open('campaigns.json', 'w') as f:
                        json.dump(campaigns, f, default=set_default)

                    # Send message
                    message = client.messages.create(
                        from_ = os.environ['SIGNALWIRE_NUMBER'],
                        body = "Thank you for subscribing to '" + phrase  + "'",
                        to = number
                    )

                    # Send email to administrator or your hook logic
                    send_email("New subscriber to campaign: " + phrase + "\n" + " Number: " + number)

    return "200"

# Listen for route/requests at endpoint
@app.route('/broadcast_msg', methods=['GET','POST'])
def broadcast_msg():

    # Initialize the SignalWire client
    client = signalwire_client(os.environ['SIGNALWIRE_PROJECT'], os.environ['SIGNALWIRE_TOKEN'], signalwire_space_url = os.environ['SIGNALWIRE_SPACE'])

    # Read phrase param, that represents campaign subscribers
    group_code = request.values.get("code")
    # Read message param, that represents message to be sent
    message = request.values.get("message")

    # Read campaigns from json file
    with open('campaigns.json') as f:
        campaigns = json.load(f)

    # Loop through subscribers, and send messages
    for number in campaigns['Subscribers']:
        message = client.messages.create(
            from_ = os.environ['SIGNALWIRE_NUMBER'],
            body = message,
            to = number
        )

    return "200"

# MailGun Send Email
def send_email(body):
    # Post to MailGun to shoot out an email
    return requests.post(
        "https://api.mailgun.net/v3/" + os.environ['MAILGUN_DOMAIN'] + "/messages",
        auth=("api", os.environ['MAILGUN_API_TOKEN']),
        data={"from": os.environ['EMAIL_FROM'],
              "to": [os.environ['EMAIL_TO']],
              "subject": os.environ['EMAIL_SUBJECT'],
              "text": body })

# Default route/endpoint
@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run(host="0.0.0.0")