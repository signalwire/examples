require('dotenv').config();
const express = require('express');
let { Task } = require('@signalwire/realtime-api')

const PORT = process.env.PORT || 8080
const app = express();
const http = require('http').createServer(app);

app.use(express.json());
app.set('view engine', 'ejs');

let {createSession, createChannel} = require("better-sse");
const channel = createChannel();

app.get("/", async (req, res, next) => {
  res.render('index', { destination: process.env.DEFAULT_DESTINATION })
})

app.post("/notify", async (req, res, next) => {
  channel.broadcast(req.body.message);
  res.json({ status: 'ok' });
})

app.post("/send", async (req, res, next) => {
  console.log(req.body);
  await Task.send({
    project: process.env.SIGNALWIRE_PROJECT_ID,
    token: process.env.SIGNALWIRE_TOKEN,
    context: 'office',
    message: { 
      number: req.body.number,
      message: req.body.message,
    }
  })
  
  res.json({ status: 'ok' });
});

app.get("/sse", async (req, res) => {
	const session = await createSession(req, res);
	channel.register(session);
});

http.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening to ${PORT}`);
});