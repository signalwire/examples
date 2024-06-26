import "dotenv/config";
import { SignalWire } from "@signalwire/realtime-api";

const client = await SignalWire({
  project: process.env.PROJECT_ID,
  token: process.env.API_TOKEN,
});

let messageClient = client.messaging;

const sendingPhoneNumber = process.env.PHONE_NUMBER;

const express = require("express");
const app = express();
const port = 3000;
const bodyparser = require("body-parser");
const isE164PhoneNumber = require("is-e164-phone-number");

app.use(bodyparser.urlencoded({ extended: true }));
app.use("/", express.static("html"));

app.post("/sendSMS", async (req, res) => {
  let { phoneno, body } = req.body;
  if (typeof body !== "string" || body === "") return res.send("Invalid body");
  if (!isE164PhoneNumber(phoneno)) return res.send("Invalid Phone Number");

  console.log("Sending message to phone number", phoneno);
  try {
    const status = await messageClient.send({
      topic: "office",
      from: sendingPhoneNumber, // The number you bought from SignalWire
      to: phoneno,
      body,
    });

    console.log(status);
    return res.send("Your SMS was sent");
  } catch (e) {
    console.error(e);
    return res.send("Error sending SMS");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
