import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { RestClient } from "@signalwire/compatibility-api";

const app = express();
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  const response = new RestClient.LaML.VoiceResponse();
  const connect = response.connect();
  const agent = connect.ai({
    voice: "en-US-Neural2-D",
    postPromptURL: "/response",
  });
  agent.prompt(
    {
      confidence: 0.4,
      frequencyPenalty: 0.3,
    },
    "You are Franklin's assistant, and your job is to collect messages for him over the phone. Start by introducing yourself, then let the caller know that Franklin is not available. You can reassure the caller that Franklin will get in touch as soon as possible. Collect the user's name and phone number, then offer to collect a message. If they do not want to leave a message, ask them to call at another time. After collecting the message, do not wait for the user to end the conversation: say goodbye and hang up the call."
  );
  agent.postPrompt(`Summarize the message as a valid anonymous json object by filling the upper case placeholders in this template:
  { "contact_info": { "name": "CONTACT_NAME", "number": "CONTACT_PHONE" }, "message": "MESSAGE" }`);
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/response", (req, res) => {
  console.log(res.body);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening");
});
