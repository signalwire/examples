import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { RestClient } from "@signalwire/compatibility-api";

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

  const transferFn = swaig.function({ name: "transfer" });
  transferFn.setPurpose("TO DO");
  transferFn.setArgument("TO DO: the number to call in std format");
  transferFn.setWebHookURL(
    `https://b66f5d6f3366.ngrok.app/function?CallSid=${encodeURIComponent(
      req.body.CallSid
    )}`
  );

  console.log(response.toString());

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/function", (req, res) => {
  console.log(req.body);
  const callSid = req.query.CallSid;

  if (req.body.function === "transfer") {
    // curl -L -X POST "https://undefined.signalwire.com/api/laml/2010-04-01/Accounts/PROJECT_ID/Calls/${encodeURIComponent(callSid)}" \
    // -H 'Content-Type: application/x-www-form-urlencoded' \
    // -H 'Accept: application/json' \
    // -u 'projectid:token' \
    // --data-urlencode "Url=https://b66f5d6f3366.ngrok.app/transfer?number=${encodeURIComponent(req.body.argument)}" \
    // --data-urlencode 'Method=POST'

    res.json({ response: "connecting" });
  }
});

app.post("/transfer", (req, res) => {
  const number = req.query.number;

  const response = new RestClient.LaML.VoiceResponse();
  dial = response.dial();
  dial.number(number);

  console.log(response.toString());

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening");
});
