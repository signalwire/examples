# Multi-Factor Authentication in Ruby

## Overview
Multi-factor authentication (MFA) is used to authenticate users of an application through the use of a secret token that is sent to them over SMS text or a voice call. It is commonly used for logging in to secure systems, but it is also gaining popularity as an one-time password (OTP) mechanism to authorize transactions or to sign documents and contracts.

SignalWire's [multi-factor authentication API](https://docs.signalwire.com/topics/relay-rest/#resources-multi-factor-authentication) provides a simple and secure flow to request and verify tokens via REST HTTP calls. This application implements a simple flow to showcase how the API operates in a Ruby environment.

<br/>

## What do I Need to Run this Code?

You can view the full code on our github [HERE](https://github.com/signalwire/signalwire-guides/tree/master/code/ruby_mfa_example)

The [SignalWire Ruby SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#ruby) will need to be installed.

Your SignalWire credentials (**API Token** , **Space URL** , and **Project ID**) can all be found in an easily copyable format within the **API** tab of your SignalWire portal. For more information on navigating your space check out this [guide](https://developer.signalwire.com/apis/docs/navigating-your-space).

Lastly, you will need to install some additional Ruby packages:
* [Sinatra](https://github.com/sinatra/sinatra) for quickly creating web applications in Ruby
* [Dotenv](https://github.com/bkeepers/dotenv) for managing our environment variables

<br/>


## How to Run the Application

<br/>

### Build using Docker
 build the container using `docker build . -t mfaruby` then run the application with `docker run -it --rm -p 4567:4567 --name mfaruby --env-file .env mfaruby`.

<br/>

### Build Natively
If you are running the application with Ruby on your computer, set up the `.env` file and then run `bundle install` followed by `bundle exec ruby app.rb`.


<br/>

## Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://signalwire.community/) or create a Support ticket if you need guidance!