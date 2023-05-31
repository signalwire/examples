import * as dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();
import express from "express";
import { RestClient } from "@signalwire/compatibility-api";
const host = process.env.HOST_APP;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/", (req, res) => {
  const response = new RestClient.LaML.VoiceResponse();
  const connect = response.connect();
  const agent = connect.ai({
    voice: "en-US-Neural2-D",
  });
  agent.setPostPromptURL("/summary");
  agent.prompt(
    {
      confidence: 0.4,
      frequencyPenalty: 0.3,
    },
    `You are the CEO's assistant.
    Your job is to answer phone calls and collect messages or transfer the caller to a human agent. 
    The CEO is not available now. Offer to take a message or transfer the caller to live agent.
    Request the caller's name.
    You are able to transfer a call to support or sales. 
    Here is a list of known numbers that you can transfer the caller to. Do not ask the caller for these numbers. Just transfer the caller by using the appropriate function. 
    | Name    | Phone Number    |
    | --------| --------------- |
    | Sales   | 12057937849     |
    | Support | 19379028398     |
    If the caller would like to leave a message for the CEO, ask for their message. 
    After collecting the message, do not wait for the user to end the conversation: say goodbye and hang up the call. 
    Be sure to hang up the call at the end of every conversation.`
  );
  agent.postPrompt(`Return a valid anonymous json object by replacing the uppercase placeholders in the following template with the caller's information.
  {"contact_name": "CONTACT_NAME", "message": "MESSAGE or TRANSFERRED"}`);

  const swaig = agent.swaig();

  const transferFn = swaig.function({ name: "transfer" });
  transferFn.setPurpose("use this when a request for a transfer is made");
  transferFn.setArgument(
    'the 10-digit phone number that matches the name given in the transfer request, in JSON format. Example: {"number": "<number>"}'
  );
  transferFn.setWebHookURL(
    `${host}/function?CallSid=${encodeURIComponent(req.body.CallSid)}`
  );

  console.log("AI agent handling new incoming call.");

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/function", async (req, res) => {
  console.log(`AI agent has invoked the ${req.body.function} function`);
  const callSid = req.query.CallSid;

  if (req.body.function === "transfer") {
    const result = await fetch(
      `https://${process.env.SPACE_URL}/api/laml/2010-04-01/Accounts/${
        process.env.PROJECT_ID
      }/Calls/${encodeURIComponent(callSid)}`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.PROJECT_ID + ":" + process.env.API_TOKEN
            ).toString("base64"),
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          Url: `${host}/transfer?number=${encodeURIComponent(
            req.body.argument.parsed.number ??
              req.body.argument.parsed[0].number
          )}`,
          Method: "POST",
        }),
      }
    );

    if (result.status !== 200) {
      res.json({ response: "Connection failed." });
      return;
    }

    res.json({ response: "Connecting..." });
  } else {
    res.json({ response: "Function not implemented" });
  }
});

app.post("/transfer", (req, res) => {
  const number = req.query.number;

  const response = new RestClient.LaML.VoiceResponse();
  const dial = response.dial();
  dial.number(number);

  console.log(
    `Transferring to ${number} with XML instructions: ` + response.toString()
  );

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/summary", (req, res) => {
  console.log("Call from " + req.body.caller_id_number);
  if (req.body.post_prompt_data.parsed) {
    console.log(req.body.post_prompt_data.parsed[0]);
  } else if (req.body.post_prompt_data) {
    console.log(req.body.post_prompt_data);
  } else {
    console.log("AI agent did not record a message.");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening");
});
