# Overview
This guide will use <stream> and websockets to recieve base64 audio, which can be written to an audio file for storage, playback, or further manipulation such as transcription services. This guide will focus on taking inbound and outbound audio tracks from a call and saving them to a Wave file.

📖 [Read the full guide](https://developer.signalwire.com/apis/docs/utilizing-websockets-and-call-streams)

# What do I need?

If you are running Python 3.10, the only package you should have to install is [PyWav](https://pypi.org/project/pywav/). If you are running older versions of Python, you may also have to install [websockets](https://pypi.org/project/websockets/) / [asyncio](https://pypi.org/project/asyncio/)

Additionally for this guide, and testing purposes we will use [ngrok](https://ngrok.com/) to expose our port to the internet.


# How to run the application

To run the application, simply run `app.py`, and create an ngrok tunnel for appropriate port. By default this will be port 5000.

You may need to use an SSH tunnel for testing this code if running on your local machine. – we recommend [ngrok](https://ngrok.com/). You can learn more about how to use ngrok [here](https://developer.signalwire.com/apis/docs/how-to-test-webhooks-with-ngrok).

# Code Walkthrough
Within the github you will find two files, the `app.py` file, and this `readme.md`.

## Handling incoming Websocket Messages

First we will set up some variables for later use. `inboundAudio` and `outboundAudio` are lists that will contain our base64 audio payloads.
`saveInbound` and `saveOutbound` are booleans that will determine whether or not we write the audio payloads to a wave file later in our script.
```python
async def audioComp(websocket):
    inboundAudio=[]
    outboundAudio=[]
    saveInbound=False
    saveOutbound=True
```

Now we will create a try:except block to handle the messages from our websocket connection.
This try:except just catches closed connections, as we do not always recieve a close message from SignalWire.

Then we can use asyncio to create a non-blocking for loop that iterates over the messages we recieve from the websocket
each message will be in the form of a json string, so we will use json.loads to bring our data back to a more manageable format.

Finally, we will parse our messages based on their `event` designation. 

The `start` event provides details such as the callSid, streamSid, the tracks we can expect, and more. 
A full example can be found in our `<stream>` documentation [here](https://developer.signalwire.com/compatibility-api/reference/stream#websocket-messages).

The `media` events hold the base64-encoded audio that we will use to compile our wave files. We can do this by decoding the base64 and appending the bytes to the appropriate list.
```
    try:
        async for message in websocket:
            msg=json.loads(message)
            if msg['event'] == 'start':
                callId = msg['event']['callSid']
            if msg['event'] == 'media':
                media = msg['media']
                if media['track'] == 'inbound':
                    inboundAudio.append(base64.b64decode(media['payload']))
                if media['track'] == 'outbound':
                    outboundAudio.append(base64.b64decode(media['payload']))
```

The last event we listen for is the `stop` event. When we recieve this stop, we will join our array of bytes,
and compile each track into its own `.wav` file using the pywav library.

In some cases we may only want to recieve/handle a certain track, which is why we use the `saveInbound` and `saveOutbound` variables to toggle them on or off.
By default, the audio files will save as `Inbound-` and `Outbound-` followed by the `callSID`.

```
            if msg['event']=='stop':
                print('recieved stop, writing audio')

                if saveInbound==True:
                    inbound_bytes = b"".join(inboundAudio)
                    wave_write = pywav.WavWrite("Inbound-"+callId+".wav", 1, 8000, 8, 7)
                    wave_write.write(inbound_bytes)
                    wave_write.close()

                if saveOutbound==True:
                    outbound_bytes = b"".join(outboundAudio)
                    wave_write = pywav.WavWrite("Outbound-"+callId+".wav", 1, 8000, 8, 7)
                    wave_write.write(outbound_bytes)
                    wave_write.close()

```
Finally, we close our try:except by ensuring we do not error out when our websocket closes without the appropriate message
```
    except websockets.ConnectionClosed:
        print('connection ended')
```


## Serving our Websocket Server
To serve our websocket server we can just make an async function called main, use the websockets package to serve our websocket server.

`websockets.serve` takes three arguments (for our use), which will be the function we use to handle the messages, the host, and the port.

Finally, we can serve this server indefinitely by using `await asyncio.Future()`, and then by calling this function with `asyncio.run(main)`

```python
async def main():
    async with websockets.serve(audioComp,'localhost',5000):
        await asyncio.Future()

asyncio.run(main())

```

## Testing The Application

Now that we understand how the application runs, we can use ngrok, and a LaML bin to test it out!

### Set up your ngrok tunnel
By default, our websocket will run on localhost:5000, so once ngrok is installed we can use `ngrok http 5000` to create a new tunnel, and grab the URL.

### Set up a LaML bin
Now we will set our `<Stream> url` to the ngrok tunnel we just created, replacing the `http` with `wss`.

Here we can also specify which track we would like to stream to our websocket. By default we will stream the inbound audio (the caller's audio into SignalWire), but here we can set `track` to the `outbound_track`

Doing this will allow us to hear the opposite leg of the call, such as the audio from SignalWire, or the opposite leg of a call connected with the `<dial>` verb.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Start>
        <Stream url="wss://8dd4-2601-5c2-4400-3a90-bdea-cd5a-e3f9-fde3.ngrok.io" track="outbound_track" />
    </Start>
    <say>Congratulations, this is the outbound audio stream</say>
</Response>
```
