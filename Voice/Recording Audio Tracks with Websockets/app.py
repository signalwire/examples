import base64
import json
import websockets
import asyncio
import pywav


async def hello(websocket):
    inboundAudio=[]
    outboundAudio=[]
    saveInbound=True
    saveOutbound=True
    try:
        async for message in websocket:
            msg=json.loads(message)
            if msg['event'] == 'start':
                callId = msg['start']['callSid']
            if msg['event'] == 'media':
                media = msg['media']
                if media['track'] == 'inbound':
                    inboundAudio.append(base64.b64decode(media['payload']))
                if media['track'] == 'outbound':
                    outboundAudio.append(base64.b64decode(media['payload']))

            if msg['event']=='stop':
                print('recieved stop, writing audio')

                if saveInbound == True:
                    inbound_bytes = b"".join(inboundAudio)
                    wave_write = pywav.WavWrite("Inbound-" + callId + ".wav", 1, 8000, 8, 7)
                    wave_write.write(inbound_bytes)
                    wave_write.close()

                if saveOutbound == True:
                    outbound_bytes = b"".join(outboundAudio)
                    wave_write = pywav.WavWrite("Outbound-" + callId + ".wav", 1, 8000, 8, 7)
                    wave_write.write(outbound_bytes)
                    wave_write.close()

    except websockets.ConnectionClosed:
        print('connection ended')

async def main():
    async with websockets.serve(hello,'localhost',5000):
        await asyncio.Future()

asyncio.run(main())