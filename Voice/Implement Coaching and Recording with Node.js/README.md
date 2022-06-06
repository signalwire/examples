# Implement Coaching and Recording with Node.js

## Overview

This guide will show you how to use Coaching and Recording features. Quickly learn how to implement conference controls that are the foundation of many call center dial flows. 

The [Coach](https://developer.signalwire.com/compatibility-api/reference/conference-noun#coaching-a-conference-call) attribute accepts a call SID of a call that is currently connected to an in-progress conference. The application we will be building out examines an agent and a customer on a call, with a supervisor who later joins by coaching the conference.

<br/>

## What do I need to run this application?

You will need to install [SignalWire's Node.js Relay SDK](https://docs.signalwire.com/topics/relay-sdk-nodejs/v2/#relay-sdk-for-node-js)

You will also need to have a SignalWire phone number, and have your SignalWire Space credentials ready to go (**API Token, Space URL, and Project ID**). You can find all of these credentials in an easily-copyable format under the **API** tab of your SignalWire Space. For more information on where to find this stuff, check out our [Navigating your SignalWire Space](doc:navigating-your-space) section!


<br/>
<br/>

## Running the Application
<br/>

### Build and Run on Docker

1. Use our pre-built image from Docker Hub 
```
docker pull signalwire/snippets-coaching:node
```

1. Or, build your own image!
```
docker build -t snippets-coaching .
```
2. Run your image
```
docker run --publish 5000:5000 --env-file .env snippets-coaching
```
3. The application will run on port 5000

<br/>

### Build and Run Natively

Let's set up your Node.js environment with Express to handle web requests.

On the command line in your current directory, run the following command:

To install Signalwire SDK via NPM (Node Package Manager)
```
npm install @signalwire/node
```
To install express via NPM (Node Package Manager)
```
npm install express
```

To build your react components run
```
npm run build
```

To run the example, and start the express server run the following command.
The server will run on port 5000, you can change the port in the code if you wish.
```
node server.js
```
You can now load the dashboard by visiting your hostname on port 5000, and as you make calls they will appear on the dashboard.

<br/>

### Set up your Evironment Variables

1. Copy from example.env and fill in your values
2. Save new file called .env

Your file should look something like this
```
# This is the full name of your SignalWire Space. e.g.: example.signalwire.com
SIGNALWIRE_SPACE=
# Your Project ID - you can find it on the `API` page in your Dashboard.
SIGNALWIRE_PROJECT=
# Your API token - you can generate one on the `API` page in your Dashboard
SIGNALWIRE_TOKEN=
# The phone number you'll be using for this guide. Must include the `+1`, 
INBOUND_NUMBER=
# The phone number you'll be using for this guide. Must include the `+1`, 
AGENT_NUMBER=
# The phone number you'll be using for this guide. Must include the `+1`, 
SUPERVISOR_NUMBER=
# Hostname, the IP address, or Fully Qualified Domain Name of your host and port, for routing action URLs
HOSTNAME=
```
<br/>

## Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!