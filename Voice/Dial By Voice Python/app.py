import os
import requests
import time
import pprint
import json
import re

from signalwire.rest import Client as signalwire_client
from signalwire.voice_response import VoiceResponse, Say, Gather
from flask import Flask,request

app = Flask(__name__)

# accept web requests to '/dial-verify'
@app.route('/dial-verify', methods=['GET', 'POST'])
def dial_verify():

    # Initialize VoiceResponse
    response = VoiceResponse()

    if "SpeechResult" in request.values:
        if request.values.get("SpeechResult") == "Yes.":

            # Read the passed in number to dial from the request
            number_to_dial = request.values.get("number_to_dial")

            # Append the gather
            response.dial(number_to_dial)
            return str(response)

    response.say("OK. Thank you for calling goodbye!")
    return str(response)

# accept web requests to /voice_dial route from GET or POST
@app.route('/dial-prompt', methods=['GET', 'POST'])
def dial_prompt():

    # Initialize VoiceResponse
    response = VoiceResponse()

    # check if user input was provided via dtmf entry
    if "SpeechResult" in request.values:

        # Read speech result
        speech_result = request.values.get("SpeechResult")

        # Validate Number Provided
        number = re.sub("[^0-9]", "", speech_result)

        # Make E164
        if len(number) == 11:
            number = "+" + number

        # Assume US Number, Make E164
        elif len(number) == 10:
            number = "+1" + number

        # We did not determine a valide phone number
        else:
            response.say("I am sorry, I did not understand you.  Please try again.", voice="man")
            response.redirect("/dial-prompt")
            return str(response)

        # Prompt user
        gather = Gather(action='/dial-verify?number_to_dial=' + number, input='speech', speechTimeout="auto", timeout="10", method='GET')

        # Append say to gather to produce TTS
        gather.say("We detectected " + speech_result + " Would you like me to connect you? ")

        # Append the gather
        response.append(gather)

        # Hangup the call
        response.hangup()

    else:

        # Prompt user
        gather = Gather(action='/dial-prompt', input='speech', speechTimeout="auto",  timeout="10", method='GET')

        # Append say to gather to produce TTS
        gather.say("What number would you like to dial?")

        # Append the gather 
        response.append(gather)

        # Hangup the call
        response.hangup()

    # return response
    return str(response)

# Default route
@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run(host="0.0.0.0")
