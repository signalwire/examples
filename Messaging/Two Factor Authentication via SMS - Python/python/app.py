import os
import requests
import random
import pprint
import json

from signalwire.rest import Client as signalwire_client
from flask import Flask,request

app = Flask(__name__)

# Var to store challenge sessions
data = {}
data['requests'] = []

# Lookup auth session, and verify if it matches
def lookup_code(number,code):

    # Loop through all sessions
    for i in range(len(data['requests'])):
        # Look if number is equal to a number in a session, we are prepending a '+'
        if '+' + number == data['requests'][i]['number']:
            # Great, We found a session matching that number, now let us check the challenge code
            if code == data['requests'][i]['code']:
                # We have a match, let's remove the validated session and return true
                data['requests'].pop(i)
                return True
    # Catch all for failed challenges
    return False

# Listen for '/validate-auth' route
@app.route('/validate-auth')
def validate_auth():
    # Grab the authorization code from the GET/POST request
    check_code = request.values.get('auth_code')
    # Grab the phone number from the GET/POST request
    number = request.values.get('number')

    # Verify the number and challenge code
    if lookup_code(number, check_code):
        # Return 200, On Accept
        return "200"

    # Return 403, On Forbidden
    return "403"

# Listen on '/request-auth' for creation of an challenge session from GET/POST requests
@app.route('/request-auth', methods=['GET', 'POST'])
def request_auth():

    # Initialize SignalWire client
    client = signalwire_client(os.environ['SIGNALWIRE_PROJECT'], os.environ['SIGNALWIRE_TOKEN'], signalwire_space_url = os.environ['SIGNALWIRE_SPACE'])

    # Generate a randome 6 digit code between 123456 - 987654
    auth_code = str(random.randint(123456,987654))
    # Get the phone number to challenge from request
    number = "+" + request.values.get('number')

    # Add the session to the in-memory global request object
    data['requests'].append({
        'number': number,
        'code': auth_code
    })

    # Send a message, with challenge code to phone number provided.
    message = client.messages.create(
        from_=os.environ['SIGNALWIRE_NUMBER'],
        body= "Your authorization code is: " + auth_code,
        to= number
    )

    # Return 200
    return "200"

# Default route
@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run(host="0.0.0.0")
