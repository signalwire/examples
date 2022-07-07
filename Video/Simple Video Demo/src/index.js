require("dotenv").config();

require('log-timestamp');

const auth = {
    username: process.env.SIGNALWIRE_PROJECT_ID, // Project-ID
    password: process.env.SIGNALWIRE_API_TOKEN // API token
};
const apiurl = `https://${process.env.SIGNALWIRE_SPACE_URL}/api/video/`;

const fs = require('fs')
const key_file_path = process.env.KEY_FILE_PATH;
const cert_file_path = process.env.CERT_FILE_PATH;
const http = require('http')
const https = require('https')

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
                    "room.self.video_unmute",
                    "room.hide_video_muted"
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
    if (typeof key_file_path === "undefined" || typeof cert_file_path === "undefined") {
        http.createServer(app).listen(port, () => {
            console.log("HTTP Server listening at port", port);
        });
    }
    else {
        const https_options = {
            key: fs.readFileSync(key_file_path),
            cert: fs.readFileSync(cert_file_path)
        };

        console.log("KEY: ", https_options.key, " CERT: ", https_options.cert);
        https.createServer(https_options, app).listen(port, () => {
            console.log("HTTPS Server listening at port", port);
        });
    }
}

// Start the server
start(4000);