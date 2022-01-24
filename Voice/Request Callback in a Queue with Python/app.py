import os
import requests
import time
import pprint
import json
import threading

from signalwire.rest import Client as signalwire_client
from signalwire.voice_response import VoiceResponse, Say, Gather
from flask import Flask,request

app = Flask(__name__)

# Listen to route /text_request_call for text messages to process
@app.route('/text_request_call', methods=['GET', 'POST'])
def text_request():
    # Setup the Signalwire client to process commands via Compatibility API
    client = signalwire_client(os.environ['SIGNALWIRE_PROJECT'], os.environ['SIGNALWIRE_TOKEN'], signalwire_space_url = os.environ['SIGNALWIRE_SPACE'])

    # Read the 'From' variable from the GET/POST request
    number = request.values.get('From')

    # Send a text message back to the number that sent it, for this demo
    message = client.messages.create(
        from_ = os.environ['SIGNALWIRE_NUMBER'],
         body = "This is a message from Signalwire, thank you for requesting a call back.  We will call you in about 3 min.",
           to = number
    )

    # Sub routine to process call, and execute the connect agent script, for this demo, we inserted a timer for demonstration purposes
    def do_call(number):

        time.sleep(120)

        # Place the call, and on connection execute connection agent script
        call = client.calls.create(
            from_ = os.environ['SIGNALWIRE_NUMBER'],
              url = "http://" + os.environ['HOSTNAME'] + "/connect_agent",
               to = number
        )

    # Run sub on seperate thread, so call does not block REST request
    t = threading.Thread(target=do_call, args=[number,])

    # Start thread
    t.start()

    return "200"

# Listen on route '/enter_queue' for GET/POST requests
@app.route('/enter_queue', methods=['GET', 'POST'])
def enter_queue():

    # Make an instance of Signalwire VoiceResponse
    response = VoiceResponse()

    # Synthesize text to speech, using Say verb
    response.say('Thank you for calling Signal wire Signals Demos.')
    # Drop caller into DemoQueue1 and send to onhold /wait_url
    response.enqueue('DemoQueue1', wait_url='/wait_url')

    # Return the VoiceResponse as a string
    return str(response)

# Listen on route '/wait_url' for GET/POST requests
@app.route('/wait_url', methods=['GET', 'POST'])
def wait_url():

    # Make instance of VoiceResponse
    response = VoiceResponse()

    # Make instance of Gather
    gather = Gather(action='/request_callback', input='dtmf', timeout="3", method='GET')
    # Append Say verb to Gather verb
    gather.say('Please hold for the next available representative.')
    # Append Play verb to Gather verb
    gather.play('https://sinergyds.blob.core.windows.net/signalwire/snoopclose.wav')
    # Append Say verb to Gather verb
    gather.say('Your call is very important to us, a representative will be with you shortly. To request a call back, press 1 and you will not lose your place in line.')
    # Append Play verb to Gather verb
    gather.play('https://sinergyds.blob.core.windows.net/signalwire/8d82b5_The_Muppet_Show_Theme_Song.mp3')
    # Append Gather to Response
    response.append(gather)

    # Return the VoiceResponse as a string
    return str(response)

# Listen on route '/request_callback' for GET/POST
@app.route('/request_callback', methods=['GET', 'POST'])
def request_callback():

    # Make instance of VoiceResponse
    response = VoiceResponse()

    # Use Say verb for TTS
    response.say('OK. Your call has been queued for call back, We will call you back shortly.  Thank you.')
    # Use Hangup verb to hangup the call
    response.hangup()

    # Read number to call back from From GET/POST request
    number = request.values.get('From')

    # Subroutine to handle call back
    def do_callback(number):

        # Setup a Signalwire Client, to use with Compatibility Api
        client = signalwire_client(os.environ['SIGNALWIRE_PROJECT'], os.environ['SIGNALWIRE_TOKEN'], signalwire_space_url = os.environ['SIGNALWIRE_SPACE'])

        # For demo purposes, sleep for 15 seconds before sending text
        time.sleep(15)

        # Send a text message to tell user, thank you and an estimated call back time.
        text = client.messages.create(
            from_ = os.environ['SIGNALWIRE_NUMBER'],
             body = "This is a message from Signalwire, thank you for requesting a call back.  We will call you in about 3 min.",
               to = number
        )

        # For demo purposes, sleep for 2 min, then continue
        time.sleep(120)

        # Perform the call back to user, and execute connect agent script
        call = client.calls.create(
            from_ = os.environ['SIGNALWIRE_NUMBER'],
              url = "http://" + os.environ['HOSTNAME'] + "/connect_agent",
               to = number
        )
    # Create a new thread to run call back, so web request is not blocking
    t = threading.Thread(target=do_callback, args=[number,])
    # Start the thread
    t.start()

    # return the VoiceResponse as a string
    return str(response)

# Listen on route '/connect_agent' for GET/POST request
@app.route('/connect_agent', methods=['GET', 'POST'])
def connect_agent():

    # Create an instance of VoiceResponse
    response = VoiceResponse()
    # Use Say verb for TTS
    response.say('This is signalwire calling you back from your request earlier.')
    # Use Play verb for audio file playback
    response.play('https://sinergyds.blob.core.windows.net/signalwire/snoopclose.wav')
    # Use Say verb for TTS
    response.say('For more excellent demos and starting projects, visit signal wire dot com')
    # Hangup the call
    response.hangup()

    # Return VoiceResponse as a string
    return str(response)

# default route, to test browser
@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run(host="0.0.0.0")