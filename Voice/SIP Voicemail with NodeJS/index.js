import express from "express";
import { RestClient } from "@signalwire/compatibility-api";

const app = express();
app.use(express.urlencoded({ extended: true }));

/**
 * This default route will be direct a call to a SIP endpoint,
 * then if the call is not answered within 15 seconds,
 * it is redirected to the voicemail route.
 */
app.post("/", (req, res) => {
  const response = new RestClient.LaML.VoiceResponse();
  response.say(
    "Welcome to SignalWire. Please wait while we connect you to an agent."
  );
  //
  const dial = response.dial({ timeout: 15, action: "/voicemail" });
  dial.number("+12057085808");
  console.log(req.body);
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/voicemail", (req, res) => {
  const response = new RestClient.LaML.VoiceResponse();
  if (req.body.DialCallStatus !== "completed") {
    // If the status is not "completed" the call was not answered.
    response.say("The agent is currently unavailable, please leave a message.");
    response.record({
      transcribe: true,
      action: "/hangup",
      transcribeCallback: "/hangup",
    });
  }
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.post("/hangup", (req, res) => {
  if (req.body.TranscriptionText) {
    console.log("Transcription text:", req.body.TranscriptionText);
  }
  if (req.body.RecordingUrl) {
    console.log("Recording Url:", req.body.RecordingUrl);
  }
  let response = new RestClient.LaML.VoiceResponse();
  response.hangup();
  res.set("Content-Type", "text/xml");
  res.send(response.toString());
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
