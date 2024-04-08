import "dotenv/config";
import { SignalWire } from "@signalwire/realtime-api";

import { phone } from "phone";

import express from "express";
import bodyparser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyparser.urlencoded({ extended: true }));
app.use("/", express.static("html"));

// Global variable to store challenge sessions
const data = { requests: [] };

const requestAuth = async (req, res) => {
  const client = await SignalWire({
    project: process.env.PROJECT_ID,
    token: process.env.API_TOKEN,
    topics: ["auth"],
  });

  let authClient = client.messaging;

  // Generate a random 6 digit code between 123456 - 987654, inclusive
  const min = 123456;
  const max = 987654;
  const code = Math.floor(Math.random() * (max - min + 1) + min);

  // Check for for proper E.164 format
  const numberInput = req.body.number;
  const phoneInfo = phone(numberInput);
  const number = phoneInfo.phoneNumber;
  if (!phoneInfo.isValid) return res.status(400).send("Invalid Phone Number");

  data.requests.push({
    number,
    code,
  });

  try {
    const status = await authClient.send({
      from: process.env.SIGNALWIRE_NUMBER, // The number you bought from SignalWire
      to: number,
      body: "Your authorization code is:" + code,
    });

    console.log(status);
    return res.status(200).send("Your code was sent");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Error sending code via SMS");
  }
};

const validateAuth = (req, res) => {
  const code = req.body.auth_code;
  const numberInput = req.body.number;
  // Check for for proper E.164 format
  const phoneInfo = phone(numberInput);
  const number = phoneInfo.phoneNumber;
  if (!phoneInfo.isValid) return res.status(400).send("Invalid Phone Number");

  const requestCount = data.requests.length;
  data.requests = data.requests.filter((s) => {
    !(s.number === number && s.code === code);
  });
  // If the request was filtered out, the auth code matched and we return 200
  // If nothing was filtered out, no match was found and we return 403
  return requestCount === data.requests.length
    ? res.status(403).send("Forbidden")
    : res.status(200).send("Success!");
};

app.post("/request-auth", requestAuth);
app.post("/validate-auth", validateAuth);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
