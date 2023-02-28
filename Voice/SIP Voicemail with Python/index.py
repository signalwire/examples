from flask import Flask,Response,request
from signalwire.voice_response import VoiceResponse
app = Flask(__name__)

@app.route("/", methods=["POST"])
def index():
    response = VoiceResponse()
    response.say("Welcome to SignalWire. Please wait while we connect you to an agent.")
    dial = response.dial(timeout=15, action="/voicemail")
    dial.sip("sip:alice@example.com")
    return Response(str(response), mimetype="text/xml")

@app.route("/voicemail", methods=["POST"])
def voicemail():
    response = VoiceResponse()
    if request.form["DialCallStatus"] != "completed":
        response.say("The agent is currently unavailable, please leave a message.")
        response.record(action="/hangup")
    return Response(str(response), mimetype="text/xml")

@app.route("/hangup", methods=["POST"])
def hangup():
    if "RecordingUrl" in request.form:
        print("Recording Url:", request.form["RecordingUrl"])
    response = VoiceResponse()
    response.hangup()
    return Response(str(response), mimetype="text/xml")

app.run(debug=True)
