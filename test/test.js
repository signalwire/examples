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

    const plan = new Voice.DeviceBuilder().add([
      Voice.DeviceBuilder.Phone({
        to: "+19379028398",
        from: "+12057966865",
        timeout: 30,
      }),
      Voice.DeviceBuilder.Phone({
        to: "+12027621401",
        from: "+12057966865",
        timeout: 30,
      }),
    ]);

    const ringback = new Voice.Playlist().add(
      Voice.Playlist.Ringtone({
        name: "it",
      })
    );
    const peer = await call.connect({
      devices: plan,
      ringback: ringback,
    });

    await peer.waitFor("ended");

    const peerConnection = await peer.promptTTS({
      text: "Press 1 to connect to caller",
      digits: { max: 1, digitTimeout: 3 },
    });

    if (peerConnection.digits !== "1") {
      call.disconnect();
      console.log("disconnected");
    }

    await call.disconnected();
    await call.playTTS({ text: "The peer disconnected" });
  } catch (error) {
    console.error("Error answering inbound call", error);
  }
});
