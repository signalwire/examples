# Forward Messages to Another Phone Number with Node.js

This super simple guide will show how you can handle incoming messages and forward them to another phone number. We will use the [SignalWire Javascript SDK](https://developer.signalwire.com/client-sdk/reference/js-exports) to handle the incoming message and [RELAY Realtime API]() to forward the message.

# Setup Your Environment File

Copy from env.sample and fill in your values.

You will need a SignalWire phone number as well as your API Credentials (API Token and Project ID) from within the API tab of your SignalWire Space.

Save the new file as `.env`.

# How to Run This Code

You can run this code natively by cloning and using the `npm start` command in your terminal.

You may also choose to run it on Docker by building the image with `docker build -t forwardsms .` followed by `docker run -it --rm -p 3000:3000 --name forwardsms --env-file .env forwardsms`

# Code Walkthrough

Read the full walkthrough on the [Forwarding Messages](https://developer.signalwire.com/apis/docs/how-to-forward-messages) guide.
