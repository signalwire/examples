import "dotenv/config";
import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { SignalWire } from "@signalwire/realtime-api";

const client = await SignalWire({
  project: process.env.PROJECT_ID,
  token: process.env.API_TOKEN,
  topics: ["user"],
});

const apiUrl = `https://${process.env.SPACE_URL}`;
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("frontend"));
const port = 3000;

let voiceClient = client.voice;
let messageClient = client.messaging;

app.post("/get_chat_token", async function (req, res) {
  const { member_id, channel } = req.body;

  const channelsPerms = {};

  channelsPerms[channel] = { read: true, write: true };

  const reply = await axios.post(
    apiUrl + "/api/chat/tokens",
    {
      ttl: 50,
      channels: channelsPerms,
      member_id,
      state: {},
    },
    {
      auth: {
        username: process.env.PROJECT_ID,
        password: process.env.API_TOKEN,
      },
    }
  );

  res.json({
    token: reply.data.token,
  });
});

// Endpoint to make the phone call
app.post("/make_call", async function (req, res) {
  try {
    const { from, to } = req.body;
    const call = await voiceClient.dialPhone({
      from: from,
      to: to,
    });
    await call.playTTS({ text: content }).onEnded();
    await call.hangup();
    return res.json({ data: "Call initiated successfully" });
  } catch (exception) {
    console.log("Call not answered", exception);
  }
});

// Endpoint to send the message
app.post("/send_message", async function (req, res) {
  try {
    const { from, to, content } = req.body;
    const message = await messageClient.send({
      from: from,
      to: to,
      body: content,
      topic: "user",
    });
    return res.json({ data: message });
  } catch (e) {
    return res.json({ data: e.message });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
