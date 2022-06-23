require("dotenv").config()

const auth = {
    username: process.env.PROJECT_ID,
    password: process.env.API_TOKEN
}

const apiUrl = `https://${process.env.SPACE_URL}`

const axios = require("axios")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const {Voice, Messaging} = require("@signalwire/realtime-api")

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('frontend'))

let client = new Voice.Client({
    project: process.env.PROJECT_ID,
    token: process.env.API_TOKEN,
    contexts: ["user"]
});

let messageClient = new Messaging.Client({
    project: process.env.PROJECT_ID,
    token: process.env.API_TOKEN,
    contexts: ['user']
})

app.post("/get_chat_token", async function (req, res) {

    const {member_id, channels} = req.body

    const channelsPerms = {}

    for (const c of channels.split(",")) {
        channelsPerms[c] = {read: true, write: true}
    }

    const reply = await axios.post(apiUrl + "/api/chat/tokens", {
        ttl: 50,
        channels: channelsPerms,
        member_id,
        state: {}
    }, {auth})

    res.json({
        token: reply.data.token
    })

})

// Endpoint to make the phone call
app.post("/make_call", async function (req, res) {
    try {
        const {from, to, content} = req.body
        const call = await client.dialPhone({
            from: from,
            to: to,
            content: content
        })

        let playback = await call.playTTS({text: content})

        await playback.waitForEnded();

        await call.hangup()

        return res.json({"data": "Call initiated successfully"})

    } catch (exception) {
        console.log("Call not answered")
    }

})

// Endpoint to send the message
app.post("/send_message", async function (req, res) {
    try {
        const {from, to, content} = req.body
        const message = await messageClient.send({
            from: from,
            to: to,
            body: content,
            context: "users"
        })
        return res.json({data: message})

    } catch (e) {
        return res.json({data: e.message})
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})