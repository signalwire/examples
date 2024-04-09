import "dotenv/config";
import storage from "node-persist";
import { SignalWire, Voice } from "@signalwire/realtime-api";

import { captcha } from "./captcha.js";
import { lenny } from "./lenny.js";
import { transfer } from "./transfer.js";

await storage.init();

if (
  !process.env.MY_NUMBER ||
  !process.env.SIGNALWIRE_PROJECT_ID ||
  !process.env.SIGNALWIRE_API_TOKEN ||
  !process.env.SIGNALWIRE_CONTEXT
) {
  console.log(process.env);
  console.error(
    "Please set the following environment variables: " +
      [
        "MY_NUMBER",
        "SIGNALWIRE_PROJECT_ID",
        "SIGNALWIRE_API_TOKEN",
        "SIGNALWIRE_CONTEXT",
      ].join(", ")
  );
  process.exit(1);
}

const MY_NUMBER = process.env.MY_NUMBER;

/**
 * This event handler is executed when a call arrives to our SignalWire
 * number.
 *
 * We will handle the call like this:
 *
 *            +--> HANGUP <---+
 *            |               |
 *     START -+--> CAPTCHA ---+    (captcha.js)
 *            |       |       |
 *            |       v       |
 *            +--> TRANSFER --+    (transfer.js)
 *            |       |       |
 *            |       v       |
 *            +---> LENNY ----+    (lenny.js)
 *
 * @param {*} call
 * @returns
 */
async function onIncomingCallHandler(call) {
  console.log("Inbound call", call.id, call.from, call.to);
  await call.answer();

  await call
    .recordAudio({
      direction: "both",
      initialTimeout: 10,
      endSilenceTimeout: 0,
      stereo: true,
      listen: {
        onStarted: (rec) => {
          console.log("Recording the call to " + rec.url);
        },
      },
    })
    .onStarted();

  const silence = new Voice.Playlist().add(
    Voice.Playlist.Silence({
      duration: 1,
    })
  );
  await call.play({ playlist: silence }).onEnded();

  let state = "START";

  while (true) {
    console.log("State:", state);

    if (state === "START") {
      const { isHuman, isScammer } = (await storage.get(call.from)) ?? {};
      console.log("isHuman:", isHuman);
      console.log("isScammer:", isScammer);

      if (isHuman === undefined) {
        // We don't know yet whether they're a human... let's check
        state = "CAPTCHA";
      } else if (isHuman && isScammer) {
        // Human scammer. Send them to Lenny.
        state = "LENNY";
      } else if (isHuman && !isScammer) {
        // Legitimate human. Transfer the call to our real phone number.
        state = "TRANSFER";
      } else {
        // It's a bot. We do nothing and hangup.
        await call.playTTS({ text: "You are a bot." });
        state = "HANGUP";
      }
    } else if (state === "HANGUP") {
      await call.hangup();
      break;
    } else if (state === "CAPTCHA") {
      const isHuman = await captcha(call);
      state = isHuman ? "TRANSFER" : "HANGUP";
    } else if (state === "TRANSFER") {
      const isScammer = await transfer(call, MY_NUMBER);
      state = isScammer ? "LENNY" : "HANGUP";
    } else if (state === "LENNY") {
      await lenny(call);
      state = "HANGUP";
    }
  }
}

/**
 * Create a SignalWire client. This allows us to pick up incoming calls to all
 * SignalWire numbers associated to the provided contexts.
 */
const client = await SignalWire({
  project: process.env.SIGNALWIRE_PROJECT_ID,
  token: process.env.SIGNALWIRE_API_TOKEN,
  topics: [process.env.SIGNALWIRE_CONTEXT],
});
const voiceClient = client.voice;

await voiceClient.listen({
  topics: [process.env.SIGNALWIRE_CONTEXT],
  onCallReceived: onIncomingCallHandler,
});
