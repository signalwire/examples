import os
import requests
import time
import pprint
import json
import threading

from collections import defaultdict
from signalwire.rest import Client as signalwire_client
from signalwire.voice_response import VoiceResponse, Say, Gather, Dial, Conference, Queue
from flask import Flask,request

app = Flask(__name__)

# read menus from json file
with open('config.json') as f:
     ccConfig = json.load(f)
     # Dump config to console, for debugging
     pprint.pprint(ccConfig)

# Set Signalwire Creds from JSON Config 
HOSTNAME = ccConfig['settings']['hostname']
SIGNALWIRE_SPACE = ccConfig['signalwire']['space']
SIGNALWIRE_PROJECT= ccConfig['signalwire']['project']
SIGNALWIRE_TOKEN= ccConfig['signalwire']['token']

# Log Data Here - For demo we will use a flat file system
def updateLogs(logType, obj):
    print('-- updateLLogs --')
    print(logType)
    print('-- Object --')
    print(obj.to_dict())

    # create file if it does not exist, and initialize it with empty json 
    if not os.path.exists(logType + ".json"):
        with open(logType + ".json", 'w') as file: 
            json.dump({logType:[]}, file)
    
    # read file
    with open(logType + ".json", 'r') as file: 
        data = json.load(file)
    
    # load the resource for modification, insert, update
    with open(logType + ".json", "w") as file:      
        ddata = obj.to_dict();

        found = False
        for x in data[logType]:
            print('x =')
            print(x)
            if x['CallSid'] == ddata['CallSid']:
                found = True
                break

        # insert if not exist
        if not found:
            data[logType].append( 
                {
                "CallSid": ddata['CallSid'],
                "Entry": ddata
                }                                  )
        else: # we will update the record
            data[logType][0] = ddata

        # Replace File
        json.dump(data, file)

    return "200"

# Access Logs
def getLogs(logType): 

    # restrict
    if logType=='voiceStats' or logType=='queueStats':
        # read file
        with open(logType + ".json", 'r') as file: 
            data = json.load(file)
            return data
        
    return {}

# Enqueue a caller to a specific queue by friendlyName, and allows you to specify params
def enqueue(queueName, action = HOSTNAME + "/enqueue_event", method = "POST", waitUrl=HOSTNAME + "/wait_music_queue", waitUrlMethod="POST"):
    response = VoiceResponse()
    response.say("Dialing " + queueName + " one moment please...", voice=ccConfig['settings']['textToSpeech']['voice'])
    response.enqueue(queueName, action=action, method=method, waitUrl=waitUrl, waitUrlMethod=waitUrlMethod)
    print(response)
    # return response
    return response

# Connects endpoint to conference by friendlyName, and allows you to specify params
def dial_conference(conferenceName, muted=False, beep=True, startConferenceOnEnter=True, endConferenceOnExit=False, statusCallbackEvent="start end join leave speaker", statusCallback=HOSTNAME + "/conference_event", statusCallbackMethod="POST"):
    response = VoiceResponse()
    response.say("Dialing " + conferenceName + " one moment please...", voice=ccConfig['settings']['textToSpeech']['voice'])
    dial = Dial()
    dial.conference(conferenceName, muted=muted, beep=beep, startConferenceOnEnter=startConferenceOnEnter, endConferenceOnExit=endConferenceOnExit, statusCallbackEvent=statusCallbackEvent,statusCallback=statusCallback, statusCallbackMethod=statusCallbackMethod)
    response.append(dial)

    print(response)

    # return response
    return response

# accepts conference events from GET or POST
@app.route('/conference_event', methods=['GET', 'POST'])
def conference_event():
    
    client = signalwire_client(SIGNALWIRE_PROJECT, SIGNALWIRE_TOKEN, signalwire_space_url = SIGNALWIRE_SPACE)
    
    # May optimize later, this will take the last conference participant and redirect them for post conference
    if request.values.get('StatusCallbackEvent') == 'participant-leave':
        participants = client.conferences(request.values.get('ConferenceSid')) \
                     .participants \
                     .list(limit=2)
        for record in participants:
            print(record.call_sid)
            redirectByRestApi(record.call_sid, '/post_conference')
   
    pprint.pprint(request.values)

    # return response
    return "200"

# Generates wait music, and queue stat updates
@app.route('/wait_music_queue', methods=['GET', 'POST'])
def wait_music_queue():
    count = 0
    if request.values.get('count'):
        count = int(request.values.get('count')) + 1

    response = VoiceResponse()
      
    # Update the queueStats Logs
    updateLogs('queueStats', request.values)

    # Load the queueStatsMessage from config
    queueStatsMessage = ccConfig['settings']['messages']['queueStatsMessage']
    # Replace Template Vars With Values
    queueStatsMessage = queueStatsMessage.replace("%QueuePosition%", str(request.values.get("QueuePosition")))
    queueStatsMessage = queueStatsMessage.replace("%CurrentQueueSize%", str(request.values.get("CurrentQueueSize")))
    queueStatsMessage = queueStatsMessage.replace("%AvgQueueTime%", str(request.values.get("AvgQueueTime")))

    # If enabled play queueStats to caller on hold
    response.say(queueStatsMessage, voice=ccConfig['settings']['textToSpeech']['voice'])

    if ccConfig['settings']['enableWaitingAds']:
        if count < len(ccConfig['settings']['waitingAds']):
            response.play(ccConfig['settings']['waitingAds'][count])
        else:
            count = 0
            response.play(ccConfig['settings']['waitingAds'][count])

    if ccConfig['settings']['enableWaitingMusic']:
        for music in ccConfig['settings']['waitingMusics']:
            response.play(music)

    response.redirect(HOSTNAME + "/wait_music_queue?count=" + str(count), method="POST")
    return str(response)

# accepts enqueue events from GET or POST
@app.route('/enqueue_event', methods=['GET', 'POST'])
def enqueue_event():
    updateLogs('queueStats', request.values)
    # return response
    return "200"

# accepts voice status events from GET or POST
@app.route('/voice_event', methods=['GET', 'POST'])
def voice_event():
    updateLogs('voiceStats', request.values)
    # return response
    return "200"

# accepts sms messages from GET or POST
@app.route('/inbound_sms', methods=['GET', 'POST'])
def inbound_sms():
    
    # return response
    return "200"

# Updates a call and snags it, redirecting it by using the callSid and the REST LaML API
def redirectByRestApi(callSid, urlToRedirect):
    client = signalwire_client(SIGNALWIRE_PROJECT, SIGNALWIRE_TOKEN, signalwire_space_url = SIGNALWIRE_SPACE)
    
    # merge the caller into the conference with connect_agent
    caller = client.calls(callSid) \
               .update(
                   url= HOSTNAME + urlToRedirect,
                    method='POST'
                )

    print(caller.call_sid)
    return "200"

# Connects the caller to an agent by calling REST api to update call
def connect_agent_ready(queueSid, callSidOrFront, agent, channel):
    client = signalwire_client(SIGNALWIRE_PROJECT, SIGNALWIRE_TOKEN, signalwire_space_url = SIGNALWIRE_SPACE)
    
    pprint.pprint(agent)

    # Agent should always connect first, or make the first request 
    # We have an agent ready, willing and able to provide stellar customer service, add agent to conference
    # We use conference, because it gives us more power for later, and advanced features.
    endpoint = agent['channels'][channel]['endpoint']
    call = client.calls.create(
                        url = HOSTNAME + '/connect_agent',
                        to = endpoint,
                        from_ = ccConfig['settings']['outboundPhoneNumber']
                    )

    pprint.pprint(call)

    # merge the caller into the conference with connect_agent
    member = client.queues(queueSid) \
               .members(callSidOrFront) \
               .update(
                   url= HOSTNAME + '/connect_caller',
                    method='POST'
                )

    print(member.call_sid)
    return "200"

# Handle post conference, and handle caller before termination.
@app.route('/post_conference', methods=['GET', 'POST'])
def post_conference():
    response = VoiceResponse()

    # Check if announcment should be played
    if ccConfig['settings']['enableExitSurvey']:
        response.say(ccConfig['settings']['messages']['surveyEntryMessage'], voice=ccConfig['settings']['textToSpeech']['voice'])
        response.redirect(HOSTNAME + "/get_survey", Method="POST") 

    # Check if announcment should be played
    if ccConfig['settings']['enableExitMessage']:
        response.say(ccConfig['settings']['messages']['exitMessage'], voice=ccConfig['settings']['textToSpeech']['voice'])

    return str(response)

# Web entry for entering a queue, passing queue name as a querystring var
@app.route('/enter_queue', methods=['GET', 'POST'])
def enter_queue():
    response = enqueue( str(request.values.get("name")) )
    # return response
    return str(response)

# connects the agent to the conference with caller
@app.route('/connect_agent', methods=['GET', 'POST'])
def connect_agent():

    # Logic To Find Best Agent
    response = dial_conference( str(request.values.get("name")) )
    # return response
    return str(response)

# connects the caller to the conference with agent
@app.route('/connect_caller', methods=['GET', 'POST'])
def connect_caller():
    response = dial_conference( str(request.values.get("name")) )
    # return response
    return str(response)

# Send email with MailGun
def send_email(_from, to, subject, body):
    return requests.post(
        "https://api.mailgun.net/v3/" + ccConfig['mailgun']['domain'] + "/messages",
        auth=("api", ccConfig['mailgun']['token']),
        data={"from": _from,
              "to": [to],
              "subject": subject,
              "text": body })

# Enable recording for this call
def enableRecording(callSid):
    client = signalwire_client(SIGNALWIRE_PROJECT, SIGNALWIRE_TOKEN, signalwire_space_url = SIGNALWIRE_SPACE)
    
    #POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Calls/{CallsSid}/Recordings.json
    recording = client.calls(callSid) \
                  .recordings \
                  .create()
    pprint.pprint(recording)

    return "200"

# Accepts inbound voice call requests
@app.route('/inbound_voice', methods=['GET', 'POST'])
def inbound_voice():
    response = VoiceResponse()

    # Check if call should be recorded
    if ccConfig['settings']['enableRecording']:
        enableRecording(str(request.values.get('CallSid')))

    response.say(ccConfig['settings']['messages']['entryMessage'], voice=ccConfig['settings']['textToSpeech']['voice'])

    # Check if announcment should be played
    if ccConfig['settings']['enableAnnouncment']:
        response.say(ccConfig['settings']['messages']['announcmentMessage'], voice=ccConfig['settings']['textToSpeech']['voice'])

    # Redirect to the main menu set in config.json
    response.redirect(HOSTNAME + "/get_menu?menu=" + ccConfig['settings']['mainMenu'], method="POST")
    
    # return response
    return str(response)

# Dynamically builds IVR menu tree, and action routing, adapted from previous snippet
@app.route('/get_menu', methods=['GET', 'POST'])
def get_menu():
    response = VoiceResponse()

    # read menus from config
    menus = ccConfig['settings']['menus']

    # check to see if a default menu was specified, else default to "main"
    menu = request.values.get("menu")
    if menu not in menus:
        menu = "main"

    # read input_type variable
    input_type = request.values.get("input_type")

    # check if user input was provided via dtmf entry
    if input_type == "dtmf":
        # get digits pressed at menu
        digits = request.values.get("Digits")
        input_action = menus[menu][digits]["action"]
        response.redirect(url=input_action)
        response.hangup()
    else:
        # no user input was detected, so lets present a menu
        gather = Gather(action='/get_menu' + "?menu=" + menu, input='dtmf', timeout="5", method='POST', numDigits="1")

        # loop through menus and generate menu options
        for key in menus[menu]:
            print(key, '->', menus[menu][key]["verbiage"])
            gather.say(menus[menu][key]["verbiage"], voice=ccConfig['settings']['textToSpeech']['voice'])

        # add menu to response
        response.append(gather)
        response.hangup()

    # return response
    return str(response)

# Mock voicemail rendering for demo
@app.route('/get_survey', methods=['GET', 'POST'])
def get_survey():
    response = VoiceResponse()
    response.say('This is a survey placeholder...', voice=ccConfig['settings']['textToSpeech']['voice'])
    return str(response)

# Api entry to retrieve logs for front-end, WARNING: ADD SECURITY FOR PRODUCTION SYSTEMS!!! THIS IS FOR DEMONSTRATION ONLY!
@app.route('/api/logs/<name>', methods=['GET'])
def get_log_entries(name):  
    return getLogs(name)

# Mock voicemail rendering for demo
@app.route('/get_voicemail', methods=['GET', 'POST'])
def get_voicemail():
    response = VoiceResponse()
    response.say('You have reached our voicemail, please leave a message.', voice=ccConfig['settings']['textToSpeech']['voice'])
    response.hangup()
    return str(response)

# We are assuming an agent is ready for this snippet, by hitting this url it will connect the caller and agent.
@app.route('/make_connection')
def make_connection():
    pprint.pprint(request.values)

    # Get channel and friendlyQueueName type so we know who/what to serve
    channel = request.values.get("channel")
    friendlyQueueName = request.values.get("name")

    # Check in config for a pre-defined queue and return its queueSid
    if friendlyQueueName in ccConfig['settings']['queues']:
        # Find queueSid from friendlyName
        queueSid = ccConfig['settings']['queues'][friendlyQueueName]['queueSid']
        pprint.pprint(queueSid)

        #pprint.pprint(ccConfig['settings']['agents'])

        # Find Qualified Agent Logic Goes Here
        for agent in ccConfig['settings']['agents']:
            pprint.pprint(agent)
            if channel in ccConfig['settings']['agents'][agent]['channelsEnabled']:
                # Will connect the caller and agent together in a conference.  This gives us more power for advanced features later.
                connect_agent_ready(queueSid, 'Front', ccConfig['settings']['agents'][agent], channel)
                # Attempt to bridge caller and agent in a conference 
                return "Connecting ..."

    # Return failed if can not find the queue in the config
    return "Failed ..."

if __name__ == '__main__':
    app.run(host="0.0.0.0")
