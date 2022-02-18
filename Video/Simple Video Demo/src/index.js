const auth = {
    username: process.env.SIGNALWIRE_PROJECT_ID, // Project-ID
    password: process.env.SIGNALWIRE_API_TOKEN // API token
};
const apiurl = `https://${process.env.SIGNALWIRE_SPACE_URL}/api/video/`;

// Basic express boilerplate
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());
// End basic express boilerplate

// Endpoint to request token for video call
app.post("/get_token", async (req, res) => {
    let { user_name, room_name } = req.body;
    console.log("Received name", user_name);
    try {
        let token = await axios.post(
            apiurl + "/room_tokens",
            {
                user_name,
                room_name: room_name,
                permissions: [
                    "room.list_available_layouts",
                    "room.set_layout",
                    "room.self.audio_mute",
                    "room.self.audio_unmute",
                    "room.self.video_mute",
                    "room.self.video_unmute"
                ]
            },
            { auth }
        );
        console.log(token.data.token);
        return res.json({ token: token.data.token });
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
});

app.use(express.static("src/frontend/"));

async function start(port) {
    app.listen(port, () => {
        console.log("Server listening at port", port);
    });
}

// Start the server
start(8080);