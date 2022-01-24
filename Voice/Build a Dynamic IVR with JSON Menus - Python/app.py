import json
from signalwire.voice_response import VoiceResponse, Say, Gather
from flask import Flask, request

app = Flask(__name__)


# use a dictionary to employ a switch statement so each voicemail box is customized to the department who is
# receiving it
def choose_voicemail(args):
    switcher = {
        "sale_partners": "Thank you for calling the SignalWire Sales Team. Your requested Account Executive is "
                         "unavailable at the moment. "
                         "Please leave us a detailed message including your account name, phone number, "
                         "and a description of how we can help. "
                         "A member of our team will reach out as soon as possible. "
                         "The recording will begin after the beep. Press the pound key when finished. "
        ,

        "sales_support": "Thank you for calling the SignalWire Sales Team. We are unavailable to take your call at "
                         "this time. "
                         "Please leave us a detailed message including your name, phone number, "
                         "and the product you are interested in purchasing/learning more about. "
                         "A member of our team will reach out as soon as possible. "
                         "The recording will begin after the beep. Press the pound key when finished. ",

        "work_support": "Thank you for calling the SignalWire Work Support Team. We are unavailable to take your call "
                        "at "
                        "this time. "
                        "Please leave us a detailed message including your name, phone number, "
                        "the name of your SignalWire Work instance, and a description of the issue that you're "
                        "encountering "
                        "A member of our team will reach out as soon as possible. "
                        "The recording will begin after the beep. Press the pound key when finished. ",

        "cloud_support": "Thank you for calling the SignalWire Cloud Support Team. We are unavailable to take your "
                         "call at "
                         "this time. "
                         "Please leave us a detailed message including your name, phone number, "
                         "the name of your Account, SignalWire Space Name, and a description of the issue that you're "
                         "encountering "
                         "A member of our team will reach out as soon as possible. "
                         "The recording will begin after the beep. Press the pound key when finished. ",

        "stack_support": "Thank you for calling the SignalWire Stack Support Team. We are unavailable to take your "
                         "call at "
                         "this time. "
                         "Please leave us a detailed message including your name, phone number, "
                         "the name of your SignalWire Stack Account, and a description of the issue that you're "
                         "encountering "
                         "A member of our team will reach out as soon as possible. "
                         "The recording will begin after the beep. Press the pound key when finished. ",
    }

    errorOccurred = "An error occurred. We could not route to the correct agent. Please record a message with detailed " \
                    "information and we will get back to you as soon as possible. "

    return switcher.get(args, errorOccurred)


# take chosen salespersons name and point to their SignalWire line
def choose_salesman(args):
    switcher = {
        "alice": '+12342186054',

        "bob": '+12342186054',

        "charlie": '+12342186054',

        "general": '+12342186054',
    }
    errorOccurred = "An error occurred. We could not route to the correct agent. Please record a message with detailed " \
                    "information and we will get back to you as soon as possible. "
    return switcher.get(args, errorOccurred)


# take chosen support department and point to their SignalWire line
def choose_support(args):
    switcher = {
        "cloud_support": '+12342186054',

        "stack_support": '+12342186054',

        "work_support": '+12342186054',

    }
    errorOccurred = "An error occurred. We could not route to the correct agent. Please record a message with detailed " \
                    "information and we will get back to you as soon as possible. "
    return switcher.get(args, errorOccurred)


# accept web requests to /get_menu route from GET or POST
@app.route('/get_menu', methods=['GET', 'POST'])
def get_menu():
    response = VoiceResponse()

    # read menus from json file
    with open('menus.json') as f:
        menus = json.load(f)

    # check to see if a default menu was specified, else default to "main"
    menu = request.values.get("menu")
    if menu not in menus:
        response.say("Thank you for calling SignalWire! Please listen closely to the options in order to direct your "
                     "call.")
        menu = "main"

    # read input_type variable
    input_type = request.values.get("input_type")

    # check if user input was provided via dtmf entry
    if input_type == "dtmf":
        # get digits pressed at menu
        digits = request.values.get("Digits")
        input_action = menus[menu][digits]["action"]
        response.redirect(url=input_action)
    else:
        # no user input was detected, so lets present a menu
        gather = Gather(action='/get_menu' + "?menu=" + menu, input='dtmf', timeout="3", method='GET')

        # loop through menus and generate menu options
        for key in menus[menu]:
            print(key, '->', menus[menu][key]["verbiage"])
            gather.say(menus[menu][key]["verbiage"])

        # add menu to response
        response.append(gather)

    # return response
    return str(response)


# dial particular salesmen using name and group assigned in menus.json
@app.route('/dial_sales', methods=['GET', 'POST'])
def dial_sales():
    group = request.args.get('group')
    name = request.args.get('name')
    response = VoiceResponse()
    response.dial(choose_salesman(name), action='/handleDialCallStatus?group=' + group, methods=['GET', 'POST'])
    return str(response)


# dial specific support department using name and group assigned in menus.json
@app.route('/dial_support', methods=['GET', 'POST'])
def dial_support():
    group = request.args.get('group')
    response = VoiceResponse()
    response.dial(choose_support(group), action='/handleDialCallStatus?group=' + group, methods=['GET', 'POST'])
    return str(response)


@app.route('/handleDialCallStatus', methods=['GET', 'POST'])
def handle_dial():
    group = request.args.get('group')
    status = request.args.get('DialCallStatus')

    response = VoiceResponse()
    if status != 'answered':
        print(status)
        response.redirect(url='/get_voicemail?group=' + group)
    else:
        print(status)
    return str(response)


# Play voicemail if no one picks up
@app.route('/get_voicemail', methods=['GET', 'POST'])
def get_voicemail():
    group = request.args.get('group')
    response = VoiceResponse()
    response.say(choose_voicemail(group))
    response.record(action='/hangup', method='POST', max_length=15, finish_on_key='#')
    return str(response)


# hangup bin used for action url in above route
@app.route('/hangup', methods=['POST'])
def hangup():
    response = VoiceResponse()
    response.say("Thank you for your message. Goodbye!")
    response.hangup()
    return str(response)


# Default route
@app.route('/')
def hello():
    return "Hello World!"


if __name__ == '__main__':
    app.run()