# Overview

![Screenshot](https://miro.medium.com/max/1400/1*hfMtntwEwpEtwl4_uR1GAg.png)

Using SignalWire RELAY you can quickly create a service to send custom text to speech calls to any number and use user input to confirm or deny appointments. You can then receive realtime information about their decisions and redirect their call programatically.

We’ve created a ready to use example that hosts both a RELAY Consumer, a call automation app, and a basic javascript web app. The web app has an interface to make calls to any number with a custom message that gets played as text to speech. If they press the option to confirm an appointment, a realtime notification is sent and displayed on the web app. If they do not confirm, they are redirected to a number you specify to reschedule.

The purpose of this example to give you a template to build call automation around. Using our example you can integrate your own calendar system or add different options and automations.

# What do I need to run this application?

- [Create a SignalWire Space](https://developer.signalwire.com/apis/docs/signing-up-for-a-space)
- [Buy a SignalWire Phone Number](https://developer.signalwire.com/apis/docs/buying-a-phone-number)
- [Verify a Phone number through SignalWire](https://swz.signalwire.com/verified_caller_ids/new) (The number calls will be redirected to for rescheduling)
- A SignalWire Project ID and API Token are required to run this example. [Follow these intructions to create a new API Token.](https://docs.signalwire.com/topics/relay/#relay-documentation-security)
- NodeJS and NPM installed on the host machine. 

## Configuring the Example

After cloning or downloading this repository, create a file named  ```.env``` and open in a text editor to replace your credentials.
There is also a file called env.example with a template for this configuration file.

```
SIGNALWIRE_PROJECT_ID=your-project
SIGNALWIRE_TOKEN=your-token

CALLER_ID=a-number-from-your-sw-account
AGENT_NUMBER=any-phone-number
DEFAULT_DESTINATION==any-phone-number
REPORTING_URL=http://localhost:8080
```

## Running the Example

Ensure you have NodeJS and NPM installed on your machine before running.

1. Open a terminal and navigate to the root directory of this project.
2. Run ```npm install``` to install all the node modules.
3. Start the app by running the the command ```npm run start```

Both the frontend/backend and the consumer should now be running.

Navigate to http://localhost:8080 to view the example. 


# Resources

- [GitHub Project](https://github.com/signalwire/signalwire-relay-examples/tree/main/node/v3-dialer)
- [CodeSandBox Instructions](https://medium.com/signalwire/build-a-call-notification-service-in-5-minutes-with-nodejs-6b0815a4e60f)

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!

