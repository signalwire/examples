import { Voice } from "@signalwire/realtime-api";

const client = new Voice.Client({
  project: "28912f87-5fa1-4808-91af-9fd095d353b1",
  token: "PTba4abf30ffde29e856f6aa8dccc52c0553433439d017e282",
  contexts: ["office"],
});

client.on("call.received", async (call) => {
  console.log("Got call", call.from, call.to);

  try {
    await call.answer();
    console.log("Inbound call answered");

    const welcome = await call.playTTS({
      text: "Hello! This is a test call. Let's find an agent.",
    });
    await welcome.ended();

    const phone1 = {
      to: "+19379028398",
      from: "+12057966865",
      timeout: 30,
    };

    const phone2 = {
      to: "+12027621401",
      from: "+12057966865",
      timeout: 30,
    };

    const collect1 = await call.collect({
      digits: {
        max: 1,
        digitTimeout: 2,
      },
    });
    const peer1 = await call.connectPhone(phone1);
    await call.playTTS({ text: "You are peer 1" });
    await peer1.playTTS({ text: "press 1 to connect" });
    await collect1.ended();

    if (collect1.digits !== "1") {
      peer1.disconnect();
    }

    const peer2 = await client.dialPhone(phone2);
    const prompt2 = await peer2.promptTTS({
      text: "Press 1 to connect with a customer",
      digits: {
        max: 1,
        digitTimeout: 5,
      },
    });
    const result2 = await prompt2.ended();

    if (result2.digits !== "1") {
      peer2.hangup();
    }

    await call.playTTS({ text: "You are connected to the agent." });

    await call.disconnected();
    await call.playTTS({ text: "The peer disconnected" });
  } catch (error) {
    console.error("Error answering inbound call", error);
  }
});
