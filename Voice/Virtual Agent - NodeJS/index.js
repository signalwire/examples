import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { RestClient } from "@signalwire/compatibility-api";
const weatherApiKey = process.env.WEATHERAPI;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/", (req, res) => {
  const response = new RestClient.LaML.VoiceResponse();
  const connect = response.connect();
  const agent = connect.ai({
    voice: "en-US-Neural2-D",
  });
  agent.setPostPromptURL("https://b66f5d6f3366.ngrok.app/response");
  agent.prompt(
    {
      confidence: 0.4,
      frequencyPenalty: 0.3,
    },
    "You are Franklin's assistant, Sam. Your job is to answer phone calls and collect messages for Franklin. You may also answer questions about weather and time only by using the swaig functions provided. Start by introducing yourself, then let the caller know that Franklin is not available. You can reassure the caller that Franklin will get in touch as soon as possible. Ask for the user's name and silently wait 2 seconds for user response. Then ask for a phone number and wait 2 seconds for caller response. Then offer to collect a message. Silently wait 2 seconds for user response. If they do not want to leave a message, ask them to call at another time. After collecting the message, do not wait for the user to end the conversation: say goodbye and hang up the call. Be sure to hang up the call at the end of every conversation."
  );
  agent.postPrompt(`Summarize the message as a valid anonymous json object by filling the upper case placeholders in this template:
  {"contact_info": {"name": "CONTACT_NAME","number": "CONTACT_PHONE"}, "message": "MESSAGE"}`);

  const swaig = agent.swaig();

  const getWeather = swaig.function({ name: "get_weather" });
  getWeather.setPurpose(
    "use when inquired about weather anywhere around the world"
  );
  const where = getWeather.setArgument(
    "The location or name of the city to get the weather for"
  );
  getWeather.setWebHookURL(
    `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${where}&aqi=no`
  );

  const getTime = swaig.function({ name: "get_time" });
  getTime.setPurpose(
    "use when asked for the current time for a particular location"
  );
  const timeLocation = getTime.setArgument(
    "The location or name of the city to get the time for"
  );
  getTime.setWebHookURL(
    `http://api.weatherapi.com/v1/timezone.json?key=${weatherApiKey}&q=${timeLocation}`
  );

  // const transfer = swaig.function({ name: "transfer" });
  // transfer.setPurpose("use this when a request for a transfer is made");
  // transfer.setArgument("The 10-digit phone number");
  // transfer.setWebHookURL("");
  // transfer.setWebHookAuthUser("");
  // transfer.setWebHookAuthPass("");

  // const sendSMS = swaig.function({ name: "send_sms" });
  // sendSMS.setPurpose("To send a message to a number over SMS");
  // sendSMS.setArgument(
  //   "<number>:<message> where <number> is the phone number to send a message to, either 10 or 11 digits and <message> is the body of the message"
  // );
  // sendSMS.setWebHookURL("");
  // sendSMS.setWebHookAuthUser("");
  // sendSMS.setWebHookAuthPass("");

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/response", (req, res) => {
  console.log(req.body);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening");
});
