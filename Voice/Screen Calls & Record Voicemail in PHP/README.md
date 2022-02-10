# Screen Calls & Record Voicemail - PHP & Slim

## Overview

In a telecommunication world as abundant as the one we are living in, it is simply not practical to answer every call that lands in your system. That is why we have created a simple solution to redirect calls based upon the caller's input to a given question. 

This example will show how you can easily handle incoming calls, screen them through a prompt, and record a voicemail if you do not want to speak with the caller at the current time based upon their answer to the prompt.

<br/>

## What do I need to run this code?
You can find the full github repository [HERE](https://github.com/signalwire/signalwire-guides/tree/master/code/php_voicemail)

This guide uses the PHP SignalWire SDK, for a guide on installation click [here](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#php)

You will need a SignalWire phone number as well as your API Credentials (**API Token**, **Space URL**, **and Project ID**) which can all be found in an easily copyable format within the **API** tab of your SignalWire portal.

For more information on where to find these, check out our [Navigating your SignalWire Space section](https://developer.signalwire.com/apis/docs/navigating-your-space)!

<br/>

## How to Run the Application

Use `composer install` to install dependencies, then run `TO_NUMBER=+15558877444 php -S localhost:8080 -t public/`, of course replacing `TO_NUMBER` with your own number you want to have calls screened to.

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok with SignalWire [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok). 


<br/>

# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!
