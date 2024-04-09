import "dotenv/config";
import parsePhoneNumber from "libphonenumber-js";
import axios from "axios";
import { SignalWire, Voice } from "@signalwire/realtime-api";

const DC_WEATHER_PHONE = "+12025891212";
const PHONE_NUMBER = process.env.PHONE_NUMBER;

const client = await SignalWire({
  project: process.env.PROJECT_ID,
  token: process.env.API_TOKEN,
  topics: ["office"],
});

const messageClient = client.messaging;
const voiceClient = client.voice;

console.log("Waiting for calls...");
await voiceClient.listen({
  topics: ["office"],
  onCallReceived: async (call) => {
    console.log("Got a call from", call.from, "to number", call.to);
    await call.answer();
    console.log("Inbound call answered");
    await call.playTTS({
      text: "Hello! Welcome to Knee Rub's Weather Helpline.",
      gender: "male",
    });
    console.log("Welcome text said");

    const ttsInfo = await call
      .promptTTS({
        text: "Please enter 1 for Washington weather, 2 for washington weather message, 3 to play rain dance, 4 to send rain dance.",
        duration: 10,
        digits: {
          max: 1,
          digitTimeout: 15,
        },
      })
      .onEnded();
    const digits = ttsInfo.digits;

    if (digits === "1") {
      // User input 1.  We are going to dial a Washington weather
      // number and connect the call.
      let peer = await call.connectPhone({
        from: call.from,
        to: DC_WEATHER_PHONE,
        timeout: 30,
        ringback: new Voice.Playlist().add(
          Voice.Playlist.TTS({
            text: "ring. ring. ring. ring. ring. ring. ring. ring",
          })
        ),
      });
      await peer.disconnected();
      console.log("Connected");
    } else if (digits === "2") {
      // User input 2.  We are going to query a weather API, find the weather of Washington,
      // and message that weather to the user's number.
      const place = "Washington DC";
      console.log(`Sending message about weather of ${place}`);
      const weather = await getWeatherFromOpenWeatherMap(place);
      const message = `${place} weather: ${
        weather.weather[0].description
      }. Temperature: ${(weather.main.temp - 273).toFixed(2)}°C`;
      console.log(message, "being sent to number", call.to);
      try {
        await messageClient.send({
          from: PHONE_NUMBER,
          to: call.to,
          body: message,
        });
      } catch (e) {
        await call
          .playTTS({
            text:
              "Sorry, I couldn't send the message." +
              (e?.data?.from_number[0] ?? " ") +
              " I will say the contents here. " +
              message,
          })
          .onEnded();
      }
    } else if (digits === "3") {
      //User input 3.  We are going to play a rain dance song hosted on our servers.
      console.log("Sending rain dance song");
      await call
        .playAudio({
          url: "https://cdn.signalwire.com/swml/April_Kisses.mp3",
        })
        .onEnded();
    } else if (digits === "4") {
      //User input 4.  We are going to ask for a phone number to dial and play a rain dance song to it.
      console.log("Sending rain song to your friend");
      const prompt = await call
        .promptTTS({
          text: "Please enter your friend's number then dial #. Please use the international format, but skip the plus sign.",
          digits: {
            max: 15,
            digitTimeout: 15,
            terminators: "#",
          },
        })
        .onEnded();
      console.log("Prompted for digits, received digits", prompt.digits);

      let digits = prompt.digits;

      let e164number;
      let number = parsePhoneNumber("+" + digits);
      let usnumber = parsePhoneNumber(digits, "US");
      if (number && number.isValid()) {
        e164number = number.number;
      } else if (usnumber && usnumber.isValid()) {
        e164number = usnumber.number;
      }
      console.log("Calling", e164number);
      if (e164number) {
        console.log("Calling with rain dance");
        callWithRainDance(e164number);
      } else {
        console.log("Invalid number", digits);
        let pb = await call.playTTS({
          gender: "male",
          text: "The number is invalid. Bye",
        });
        await pb.waitForEnded();
      }
    }
    console.log("Hanging up");
    call.hangup();
  },
});

async function callWithRainDance(number) {
  try {
    console.log("Sending Call");
    const call = await voiceClient.dialPhone({
      from: PHONE_NUMBER,
      to: number,
      timeout: 30,
    });
    console.log("sending rain dance song");
    await call
      .playAudio({
        url: "https://cdn.signalwire.com/swml/April_Kisses.mp3",
      })
      .onEnded();
    await call.hangup();
  } catch (e) {
    console.log("Call not answered.", e);
  }
}

async function getWeatherFromOpenWeatherMap(location) {
  let latlong;
  if (location === "Washington DC") latlong = "lat=38.9072&lon=-77.0367";
  else latlong = "lat=0&lon=0";
  let weather;
  try {
    weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?${latlong}&appid=c0fedc735ee57d142c09bf7bf8ed8f04`
    );
  } catch (e) {
    console.log(e);
    return { weather: [{ description: "error" }], main: { temp: 0 } };
  }
  console.log(weather.data);
  return weather.data;
}
