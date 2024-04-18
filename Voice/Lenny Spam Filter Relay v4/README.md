# Lenny Spam Call Filter with Relay and Node.js

Robocalling and spam calls have been increasing in number over the last year. Only in the US, there were 165.1 million robocalls placed in 2020, an average of 14.1 per person, including children and people who do not have a phone!

SignalWire can help with its Relay technology, which allows us to easily create a robocall protection service.

## The application

This application implements a call forwarding service with a voice CAPTCHA to determine if the caller is a human. If they are, it forwards the call to your phone number or the one you configured as the destination.

A [CAPTCHA](https://en.wikipedia.org/wiki/CAPTCHA) is an automated mechanism used to determine if the user of a service is a human or a machine. You have certainly interacted with visual ones such as "pick all of the pictures with a boat in it" on websites. In this application, we ask the caller for the result of the sum of two random numbers.

In case the incoming caller is determined to be a spammer, it is sent straight to Lenny (more on that below), and it is flagged as a robo-call if someone tries to answer the CAPTCHA three times and fails. If the caller solves the CAPTCHA, their call gets forwarded to the configured private phone number for the DID.

Once the calls are connected, the user that received the call on his private number can press `**` on his DTMF keypad at any time: this will instantly flag the caller as spammer and add it to the database. That way, if a human unwanted caller makes it through the CAPTCHA, they can still be banned.

The application uses [node-persist](https://github.com/simonlast/node-persist), a simple file-based database, to keep track of flagged numbers and automatically reject calls. In a production application, you would maybe use a different database such as PostgreSQL. Every phone number is saved and remembered, so any callers who you want to receive calls from will automatically get through the second time they dial in. Spammers, on the other hand, will just be sent to have a chat with Lenny!

Remember, the application database is persistent, so you will have to remove the `.node-persist` folder in the directory to reset the database if you would like to test multiple times with the same number, or your call will be handled automatically as a spammer or a human depending on how you responded the first time.

### What is Lenny?

[Lenny](https://en.wikipedia.org/wiki/Lenny_(bot)) is one of the most widely known anti-spam chatbots, designed to waste the time of telemarketers.

It is a set of connected audio files, spoken in a somewhat-Australian accent, that uses generic phrases such as "Are you there?" to lure a spammer into a long conversation about its "family", a supposed very smart daughter, or other topics. The average time wasted for a spam call is over 10 minutes, and it is also very fun to listen to recordings.

The bot itself is simple in its ingenuity, but setting up your own version has always been complicated due to needing some telephony infrastrucure and a bit of logic. Signalwire Relay makes it easy to do.

## Configuration

Start by copying the `env.example` file to a file named `.env`, and fill in the necessary information.

The application needs a SignalWire API token. You can sign up [here](https://signalwire.com/signup), then put the Project ID and Token in the `.env` file as `SIGNALWIRE_PROJECT_ID` and `SIGNALWIRE_API_TOKEN`.

You also need to configure a phone number where legitimate calls will be forwarded. This can be any number (i.e., your personal number), and you can set it up in the `.env` file as `MY_NUMBER`.

Finally, you need a DID (phone number) that people will call instead of dialing your own number directly. For this, buy a phone number from your SignalWire dashboard, then configure it to handle incoming calls using `Relay`, with the same Relay context name that you configure in `.env` as `SIGNALWIRE_CONTEXT`. By default, the example config file uses `captcha` as context name.

If you sign up for the first time, your account will be start in trial mode, which you can exit by making a manual top up of $5.00. You can find more information [on the Trial Mode resource page](https://signalwire.com/resources/getting-started/trial-mode).

You can find more information, including where to get your credentials and how to set up the phone number, in [the Getting Started with Relay](https://github.com/signalwire/signalwire-guides/blob/master/intros/getting_started_relay.md) guide.

## Running the application

If you are running the application locally, run `npm install` followed by `npm start`.

You can also run the application via Docker, by first building the image with `docker build -t nodelenny .` followed by `docker run -it --rm -v ``pwd``/.node-persist:/app/.node-persist --name nodelenny --env-file .env nodelenny`.

If you prefer, you can just run `sh run_docker.sh` in your shell and the container will be built and started for you.

Note that Relay runs in its own process, not within an HTTP server. Thus, it requires **no open ports**: just an outbound connection to the SignalWire servers. This allows a Consumer to be very efficient, with a small footprint. See [Deploying Relay](https://github.com/signalwire/signalwire-guides/blob/master/intros/getting_started_relay.md#deploying-relay).


## Testing it

Give a call to the phone number you set up above and prepare for a simple math quiz... unless you are a robot!

## Documentation and useful links

[Building this application, step-by-step](https://developer.signalwire.com/apis/docs/stop-robocalls-with-signalwires-communication-api-and-nodejs)

[Relay Documentation](https://docs.signalwire.com/topics/relay/#relay-documentation)

[Relay Docker Images](https://github.com/signalwire/signalwire-relay-docker)

[Getting Started with Relay](https://github.com/signalwire/signalwire-guides/blob/master/intros/getting_started_relay.md)

[SignalWire 101](https://signalwire.com/resources/getting-started/signalwire-101)

Copyright 2021, [SignalWire Inc.](https://signalwire.com)
