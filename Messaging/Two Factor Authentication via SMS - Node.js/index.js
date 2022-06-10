require("dotenv").config();
const { Messaging } = require("@signalwire/realtime-api");

const express = require("express");
const app = express();
const port = 3000;
const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({ extended: true }));

//Global variable to store challenge sessions
const data = { requests: [] };

const requestAuth = async (req, res) => {
    const authClient = new Messaging.Client({
        project: process.env.PROJECT_ID,
        token: process.env.API_TOKEN,
        contexts: ["auth"]
    });

    //Generate a random 6 digit code between 123456 - 987654
    const min = Math.ceil(123456);
    const max = Math.floor(987654);
    const code = Math.floor(Math.random() * (max - min + 1) + min);

    const number = "+" + req.query.number;
    console.log(code)
    console.log(number)
    data.requests.push({
        number,
        code
    });

    try {
        const status = await authClient.send({
            from: process.env.SIGNALWIRE_NUMBER, // The number you bought from SignalWire
            to: number,
            body: "Your authorization code is:" + code
        });

        console.log(status);
        return res.status(200);
    } catch (e) {
        console.error(e);
        return res.status(500);
    }
}

const validateAuth = (req, res) => {
    const code = req.query.auth_code;
    const number = "+" + req.query.number;

    const requestCount = data.requests.length;
    data.requests = data.requests.filter((s) => s.number === number && s.code === code);

    //If the request was filtered out, the auth code matched and we return 200
    //If nothing was filtered out, no match was found and we return 403
    return requestCount === data.requests.length ?
        res.status(403).send("Forbidden") :
        res.status(200).send("Success!");
}

app.post("/request-auth", requestAuth);
app.get("/request-auth", requestAuth);
app.post("/validate-auth", validateAuth);
app.get("/validate-auth", validateAuth);

app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});