import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { RestClient } from "@signalwire/compatibility-api";
const client = RestClient(process.env.PROJECT_ID, process.env.API_TOKEN, {
  signalwireSpaceUrl: process.env.SPACE_URL,
});

const app = express();
app.use(express.urlencoded({ extended: true }));

/**
 * This demo will call the CUSTOMER_NUMBER from the environmental variables.
 * The call will be created and the detect result will be sent to the URL specified.
 * In this case, an ngrok tunnel back to the same server.
 * In production, you can trigger calls manually as below
 * or, for example, with REST API calls pulling numbers from a CSV file.
 */
client.calls.create({
  url: process.env.SERVER_URL,
  to: process.env.CUSTOMER_NUMBER,
  from: process.env.SW_NUMBER,
  /**
   *  We will use the DetectMessageEnd value for machine detection
   * so our application can wait for the end of a voicemail message before playing a message.
   */
  machineDetection: "DetectMessageEnd",
  machineDetectionTimeout: 45,
});

// The default route receives the AMD determination and acts accordingly.
app.post("/", (req, res) => {
  console.log(req.body);
  const response = new RestClient.LaML.VoiceResponse();
  if (req.body.AnsweredBy === "human") {
    const gather = response.gather({
      action: "/dialAgent",
      method: "POST",
    });
    gather.say(
      "Hello. This is your reminder that you have an upcoming appointment this week. Press any key if you need to speak to an agent."
    );
    response.say("Thank you. See you then. Goodbye!");
    response.hangup();
    res.set("Content-Type", "text/xml");
    res.send(response.toString());
  } else if (
    req.body.AnsweredBy === "machine_end_beep" ||
    "machine_end_silence" ||
    "machine_end_other"
  ) {
    console.log("It's a machine!");
    response.pause({ length: 1 });
    response.say(
      "Hello. This is your reminder that you have an upcoming appointment this week. Please call us back if you need to update your appointment time. Goodbye!"
    );
    console.log("I left a message.");
    response.hangup();
    res.set("Content-Type", "text/xml");
    res.send(response.toString());
  } else {
    console.log("An error occurred. Detection response: ", req.body.AnsweredBy);
  }
});

/**
 * The dialAgent route will call a live agent.
 * If the agent does not answer, this demo routes to a voicemail,
 * but you may choose to dial another agent or dial several agents in parallel
 * and the first agent to pick up will be connected.
 */
app.post("/dialAgent", (req, res) => {
  console.log("connecting to agent...");
  const response = new RestClient.LaML.VoiceResponse();
  const dialAgent = response.dial({ timeout: 20, action: "/voicemail" });
  dialAgent.number(process.env.AGENT_NUMBER);
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/voicemail", (req, res) => {
  const response = new RestClient.LaML.VoiceResponse();
  if (req.body.DialCallStatus !== "completed") {
    // If the status is not "completed" the call was not answered.
    response.say("The agent is currently unavailable, please leave a message.");
    response.record({
      action: "/hangup",
    });
  }
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/hangup", (req, res) => {
  if (req.body.RecordingUrl) {
    console.log("Recording Url:", req.body.RecordingUrl);
  }
  const response = new RestClient.LaML.VoiceResponse();
  response.hangup();
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
