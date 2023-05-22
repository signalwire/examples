import * as dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();
import express from "express";
import { RestClient } from "@signalwire/compatibility-api";
const host = "https://a64c6d6107f3.ngrok.app";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/", (req, res) => {
  const response = new RestClient.LaML.VoiceResponse();
  const connect = response.connect();
  const agent = connect.ai({
    voice: "en-US-Neural2-D",
  });
  agent.setPostPromptURL(host + "/response");
  agent.prompt(
    {
      confidence: 0.4,
      frequencyPenalty: 0.3,
    },
    `You are the CEO's assistant.
    Your job is to answer phone calls and collect messages or transfer the caller to a human agent. 
    The CEO is not available now. Offer to take a message or transfer the caller to live agent.
    You are able to transfer a call to support or sales. 
    Here is a list of known numbers that you can transfer the caller to. Do not ask the caller for these numbers. Just transfer to the caller.
    | Name    | Phone Number    |
    | --------| --------------- |
    | Sales   | 12057937849     |
    | Support | 12057966865     |
    If the caller would like to leave a message for the CEO, ask for the user's name, phone number, and their message. 
    After collecting the message, do not wait for the user to end the conversation: say goodbye and hang up the call. 
    Be sure to hang up the call at the end of every conversation.`
  );
  agent.postPrompt(`If the caller chooses to leave a message, summarize the message as a valid anonymous json object by filling the upper case placeholders in this template:
  {"contact_info": {"name": "CONTACT_NAME","number": "CONTACT_PHONE"}, "message": "MESSAGE"}
  If you use the transfer function, summarize your conversation including the phone number you transferred to.`);

  const swaig = agent.swaig();

  const transferFn = swaig.function({ name: "transfer" });
  transferFn.setPurpose("use this when a request for a transfer is made");
  transferFn.setArgument(
    "the 10-digit phone number that matches the name given in the transfer request"
  );
  transferFn.setWebHookURL(
    `${host}/function?CallSid=${encodeURIComponent(req.body.CallSid)}`
  );

  console.log("got the prompt");

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/function", (req, res) => {
  console.log("function endpoint hit: " + req.body);
  const callSid = req.query.CallSid;

  if (req.body.function === "transfer") {
    fetch(
      `https://${
        process.env.SIGNALWIRE_SPACE_URL
      }/api/laml/2010-04-01/Accounts/${
        process.env.PROJECT_ID
      }/Calls/${encodeURIComponent(callSid)}`,
      {
        method: "POST",
        headers: {
          Authentication:
            "Basic" +
            Buffer.from(
              process.env.PROJECT_ID + ":" + process.env.API_TOKEN,
              "base64"
            ),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Url: `${host}/transfer?number=${encodeURIComponent(
            req.body.argument
          )}`,
          Method: "POST",
        }),
      }
    );

    res.json({ response: "connecting" });
  }
});

app.post("/transfer", (req, res) => {
  console.log("transfer endpoint hit");
  const number = req.query.number;

  const response = new RestClient.LaML.VoiceResponse();
  dial = response.dial();
  dial.number(number);

  console.log(response.toString());

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/response", (req, res) => {
  console.log(req.body);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening");
});
