import os
import requests
import pprint
import uuid
import json

from signalwire.voice_response import VoiceResponse, Say, Gather, Record
from flask import Flask, request

app = Flask(__name__)

# Your Microsoft Cognitive Services Key
subscription_key = os.environ['MICROSOFT_KEY']


def get_sentiment(input_text, input_language):
    base_url = 'https://eastus2.api.cognitive.microsoft.com/text/analytics'
    path = '/v2.0/sentiment'
    constructed_url = base_url + path

    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    # You can pass more than one object in body.
    body = {
        'documents': [
            {
                'language': input_language,
                'id': '1',
                'text': input_text
            }
        ]
    }
    response = requests.post(constructed_url, headers=headers, json=body)
    return response.json()


@app.route('/voice_entry', methods=['GET', 'POST'])
def voice_entry():
    response = VoiceResponse()

    # Prompt user
    gather = Gather(action='/sentiment', input='speech', speechTimeout="auto", timeout="10", method='GET')

    # Append say to gather to produce TTS
    gather.say("Please say a phrase or statement, and we will than analyze the verbiage and tell you the sentiment. ")

    # Append the gather
    response.append(gather)

    # Hangup the call
    response.hangup()

    return str(response)


@app.route('/sentiment', methods=['GET', 'POST'])
def sentiment():
    input_text = request.values.get("SpeechResult")
    input_lang = "en"
    output_text = ""
    output_lang = "en"
    sentimentResponse = get_sentiment(input_text, input_lang)

    # Round the score to two digits
    score = round(sentimentResponse['documents'][0]['score'], 2)

    response = VoiceResponse()
    sentimentText = ""

    # Convert score into easier to understand words
    if score > .9:
        sentimentText = "Extremely Happy"
    elif score > .8:
        sentimentText = "Very Happy"
    elif score > .7:
        sentimentText = "Happy"
    elif score > .6:
        sentimentText = "Slightly Happy"
    elif score > .5:
        sentimentText = "Middle of Road"
    elif score > .4:
        sentimentText = "Slightly Unhappy"
    elif score > .3:
        sentimentText = "Unhappy"
    elif score > .2:
        sentimentText = "Very Unhappy"
    else:
        sentimentText = "Extremely Unhappy"

    # Return result to user
    response.say("The sentiment score was " + str(score) + " which indicates user was " + sentimentText)

    return str(response)


# Default Route
@app.route('/')
def hello():
    return "Hello World!"


# List on all interfaces
if __name__ == '__main__':
    app.run(host="0.0.0.0")