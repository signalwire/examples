# Overview
This application demonstrates how easy it is to place a call, accepting both DTMF and text input, and using SignalWire's advanced TTS capabilities to speak dates and times in the correct way. If the user changes their appointment to one of the slots we offer, we will also send them a reminder SMS.

This guide shows how easy it can be to create a fully functioning call reminder system in Ruby with the SignalWire Ruby SDK and Sinatra. By the end of this guide you will hopefully understand how SignalWire's API can be used to send outbound calls and sms, as well as use text-to-speech to prompt the user for dtmf and speech input.
# What do I need to run this application?
You will need some additional packages:
[SignalWire Ruby SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#ruby)
[Sinatra](https://github.com/sinatra/sinatra) for quickly creating web applications in Ruby
[Dotenv](https://github.com/bkeepers/dotenv) for managing our environment variables

As well as a SignalWire account which you can create [here](https://m.signalwire.com/signups/new?s=1), and your SignalWire space credentials which can be found in the API tab of your SignalWire space. For more information on navigating your space check out this [guide](https://developer.signalwire.com/apis/docs/navigating-your-space).


##Resources
[Github](https://github.com/signalwire/signalwire-guides/tree/master/code/ruby_laml_reminders)
[SignalWire Ruby SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#ruby)
[Sinatra](https://github.com/sinatra/sinatra) for quickly creating web applications in Ruby
[Dotenv](https://github.com/bkeepers/dotenv) for managing our environment variables
[Ngrok](https://ngrok.com/)

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!