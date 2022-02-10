# Build a Fully Functional Call Center with Dynamic JSON Menus and Python

## Overview
This guide demonstrates how to use SignalWire APIs to create a completely functional call center where the features are controlled by the JSON configuration file `config.json` making it **exceedingly** easy to enable/disable features in minutes! The dynamic setup of the JSON menus adds a greater level of customizability to your IVR and makes modifying the structure on the fly a breeze. 

If you'd like to first try out the precursor that this application was built on, check out the guide [here](https://developer.signalwire.com/apis/docs/dynamic-ivr-using-json-menus)!

The features of this demo include all of the following: 

-> **TTS Voice**

-> **Default Entry Point**

-> **Agents Configurations**

-> **Agent Routing (default, is First_Available)**

-> **Multi-Channel (default, shows PSTN/Voice)**

-> **Accepted Channels (Determines, which channels are allowed)**

-> **Recording**

-> **Exit Survey Routing**

-> **Text Summary After Call**

-> **Announcement Message**

-> **Exit Message**

-> **Waiting Music/Message/Ads**

-> **Queue Stats Messaging with Template Vars**

-> **Agent Wrap Up Ability**

-> **Dynamic Menu Building and Routing**

-> **"Smarter" Queues Tricks to extend queues to use meta info such as skills**

-> **Recording Ability**

-> **CDR Log Handling**

-> **Text Bot Ability**
 
<br/>

## What do I need to Run the Code

You can view or fork the code in our [Github Repo](https://github.com/signalwire/snippets-simple-contact-center) to get going in no time.

This guide uses the Python SignalWire SDK, for a guide on installation click [here](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python).

You will need a SignalWire phone number as well as your API Credentials (**API Token**, **Space URL**, and **Project ID**) which can all be found in an easily copyable format within the API tab of your SignalWire portal.

<br/>

## How to Run the Application

<br/>

### Build and Run on Docker
1. Build on docker

```
./docker-build
```

2. Run your image
```
docker run --publish 80:80 sw-call-center-demo
```


**Or** if you have docker compose installed

 2.  Run your image using compose
```
docker-compose up
```

3. The application will run on port 80

<br/>

### Build and Run Natively

1. Edit config.json to build out your contact center.
2. From command line run, `python3 app.py`

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok). 

<br/>

## Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!