require("dotenv").config();
const { Messaging } = require("@signalwire/realtime-api");

const client = new Messaging.Client({
  project: process.env.PROJECT_ID,
  token: process.env.API_TOKEN,
  topics: ["office"],
});

client.on("message.received", async (message) => {
  console.log(message);
  const date = new Date().toLocaleDateString();
  const sender = message.from;
  let text = message.body;
  let media;

  if (message.media) {
    media = message.media;
    text = "media only";
  }

  const data = {
    from: process.env.ORIGINAL_NUMBER,
    to: process.env.TO_NUMBER,
    topic: "office",
    body: `At ${date} you received a message from ${sender} to ${process.env.ORIGINAL_NUMBER}. The message body was: ${text}.`,
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