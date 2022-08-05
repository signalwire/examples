require("dotenv").config();
let { Messaging } = require("@signalwire/realtime-api");

const client = new Messaging.Client({
  project: process.env.PROJECT_ID,
  token: process.env.API_TOKEN,
  contexts: ["office"],
});

const express = require("express");
const app = express();
const port = 3000;
const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({ extended: true }));

client.on("message.received", async (message) => {
  console.log(message);
  let date = new Date().toLocaleDateString();
  let text = message.body;
  let sender = message.from;
  let media;
  if (message.media) {
    media = message.media;
  }

  let data = {
    from: process.env.ORIGINAL_NUMBER,
    to: process.env.TO_NUMBER,
    context: "office",
    body: `At ${date} you received a message from ${sender} to ${process.env.ORIGINAL_NUMBER}. The message body was: '${text}'.`,
    media,
  };
  console.log(data);

  try {
    const sendResult = await client.send(data);
    console.log("Forwarding message.", sendResult);
  } catch (error) {
    console.error("Message failed to send", error);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
