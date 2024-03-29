require("dotenv").config();
const auth = {
  username: process.env.PROJECT_ID, // Project-ID
  password: process.env.API_TOKEN, // API token
};
const space_url = process.env.SPACE_URL; // <your username>.signalwire.com

if (!auth.username) {
  console.error("Error: PROJECT_ID not specified.");
  process.exit(1);
}
if (!auth.password) {
  console.error("Error: API_TOKEN not specified.");
  process.exit(1);
}
if (!space_url) {
  console.error("Error: SPACE_URL not specified.");
  process.exit(1);
}

// Basic express boilerplate
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());
// End basic express boilerplate

app.post("/get_audience_token", async (req, res) => {
  let { user_name, room_name } = req.body;
  try {
    const token = await axios.post(
      `https://${space_url}/api/video/room_tokens`,
      {
        user_name,
        room_name,
        join_as: "audience",
      },
      { auth }
    );

    return res.json({ token: token.data?.token });
  } catch (e) {
    return res.sendStatus(500);
  }
});

app.post("/get_member_token", async (req, res) => {
  let { user_name, room_name } = req.body;
  try {
    const token = await axios.post(
      `https://${space_url}/api/video/room_tokens`,
      {
        user_name,
        room_name,
        permissions: [
          "room.self.audio_mute",
          "room.self.audio_unmute",
          "room.self.video_mute",
          "room.self.video_unmute",
          "room.self.deaf",
          "room.self.undeaf",
          "room.self.set_input_volume",
          "room.self.set_output_volume",
          "room.self.set_input_sensitivity",
          "room.self.set_meta",
          "room.member.demote",
          "room.member.promote",
          "room.member.set_meta",
          "room.member.remove",
        ],
        join_audio_muted: true,
        join_as: "member",
      },
      { auth }
    );

    return res.json({ token: token.data?.token });
  } catch (e) {
    return res.sendStatus(500);
  }
});

app.post("/get_pubsub_token", async (req, res) => {
  try {
    const token = await axios.post(
      `https://${space_url}/api/pubsub/tokens`,
      {
        ttl: 43200,
        channels: {
          my_live_stream: {
            read: true,
            write: true,
          },
        },
        member_id: "system",
        state: {},
      },
      { auth }
    );

    return res.json({ token: token.data?.token });
  } catch (e) {
    return res.sendStatus(500);
  }
});

app.listen(15000, () => {
  console.log("Server listening at port", 15000);
});
