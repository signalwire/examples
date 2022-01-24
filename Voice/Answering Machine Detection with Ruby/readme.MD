# Overview 
This guide utilizes the Answering Machine Detection feature to determine whether a human or voicemail 
machine has answered the call. This allows your program to determine whether to dial a number to 
connect someone to the human or leave a message for the voicemail box. When a call is initiated with `machine_detection` set to `DetectMessageEnd`, there is a parameter posted to the webhook called AnsweredBy. The potential options here are `machine_end_other`, `machine_end_beep`, `machine_end_silence`, and `human`. If the parameter returned is anything other than human, this example will take a short pause to wait for the beep and then play a message for the intended recipient. 
If the parameter returned is human, it will dial a number to connect the human to another person.

If you are sending outbound calls, there is a high likelihood that you may hit the voicemail inbox of your intended callers. Utilizing AMD allows you to plan for that scenario 
and execute different instructions when a voicemail box picks up than when a person picks up the phone!

# What do I need to run this code?

You will need the [Ruby SignalWire SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#ruby) and the [Sinatra](http://sinatrarb.com/) framework. 

You will need a SignalWire phone number as well as your API Credentials (**API Token**, **Space URL**, and **Project ID**) which can all be found in an easily copyable format within the **API** tab of your SignalWire portal. 

# How to Run Application 

##  Build and run on Docker

Copy `env.example` to `.env` and edit the file, adding the necessary SignalWire credentials and other phone numbers you will need.

Build the image with `docker build . -t rubyamd`, then run the script using `docker run -it --rm -p 8080:8080 --name rubyamd --env-file .env rubyamd`.

## Build and run natively 

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok).


# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!