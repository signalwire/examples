# Forward Messages to Email with Node.js

This super simple guide will show how you can handle incoming messages and forward them to an email address. We will use the [SignalWire Javascript SDK](https://developer.signalwire.com/client-sdk/reference/js-exports) to handle the incoming message and [MailGun API](https://www.mailgun.com/) to send an email.

# Setup Your Environment File
Copy from .env.sample and fill in your values. 

You will need a SignalWire phone number as well as your API Credentials (API Token, Space URL, and Project ID) from within the API tab of your SignalWire Space.

You will also need your Credentials from the MailGun API.

Save new file called .env

# How to Run This Code
You can run this code natively by cloning and using the `npm start` command in your terminal.

You may also choose to run it on Docker by building the image with `docker build -t smstoemail .` followed by `docker run -it --rm -p 3000:3000 --name smstoemail --env-file .env smstoemail`

# Code Walkthrough
Read the full walkthrough on the [Forwarding Texts to Email - Node.js](https://developer.signalwire.com/apis/docs/forwarding-texts-to-email-nodejs) guide.