import * as dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();
import express from "express";
import { RestClient } from "@signalwire/compatibility-api";
const host = process.env.HOST_APP;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const ADDRESS_BOOK = {
  sales: process.env.SALES_NUMBER,
  support: process.env.SUPPORT_NUMBER,
};

// This route contains all of the information the AI agent will need for the conversation.
app.post("/", (req, res) => {
  const response = new RestClient.LaML.VoiceResponse();
  const connect = response.connect();
  // Initializing the AI agent
  const agent = connect.ai({
    voice: "en-US-Neural2-D",
  });
  agent.setPostPromptURL("/summary");
  // Give the AI agent its role. Be as specific as possible. Do not include any sensitive information because the AI agent will share it.
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
    Here is a list of departments that you can transfer the caller to: "Sales", "Support". Transfer the caller by using the appropriate function. 
    If the caller would like to leave a message for the CEO, ask for their message. 
    After collecting the message, do not wait for the user to end the conversation: say goodbye and hang up the call. 
    Be sure to hang up the call at the end of every conversation.`
  );
  // Instruct the AI agent on what information to send about this call when it is complete.
  agent.postPrompt(`Return a valid anonymous json object by replacing the uppercase placeholders in the following template with the caller's information.
  {"contact_name": "CONTACT_NAME", "message": "MESSAGE"}`);

  // SWAIG allows us to define custom external functions for the AI agent to use. Name, purpose, argument, and webhook should be set as follows.
  const swaig = agent.swaig();

  // Additional functions can be added using this same pattern.
  const transferFn = swaig.function({ name: "transfer" });
  transferFn.setPurpose("use this when a request for a transfer is made");
  transferFn.setArgument(
    'The destination to transfer to, in JSON format. Example: {"destination": "<destination>"}. Allowed values: "sales", "support".'
  );
  transferFn.setWebHookURL(
    `${host}/function?CallSid=${encodeURIComponent(req.body.CallSid)}`
  );

  console.log("AI agent handling new incoming call.");

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

// The AI agent will call this route if the caller asks requests an external action that has been defined by a SWAIG function.
app.post("/function", async (req, res) => {
  console.log(`AI agent has invoked the ${req.body.function} function`);
  const callSid = req.query.CallSid;

  if (req.body.function === "transfer") {
    // Get the destination name from the parameters (either "sales" or "support")
    const destination =
      req.body.argument.parsed.destination ??
      req.body.argument.parsed[0].destination;

    // Convert the destination name to a phone number
    const destNumber = ADDRESS_BOOK[destination.toLowerCase()];
    if (!destNumber) {
      res.json({ response: "Unknown destination." });
      return;
    }

    // Update the in-progress call to transfer to the requested number
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
          Url: `${host}/transfer?number=${encodeURIComponent(destNumber)}`,
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

// This is a helper route that will build XML and send it to the API to connect the caller with a new number.
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

// This route receives final information from the AI agent in response to the `postPrompt` that was set in the default route.
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
