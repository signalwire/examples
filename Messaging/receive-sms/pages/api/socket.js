import { Server } from "Socket.IO";
import { Messaging } from "@signalwire/realtime-api";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    // Socket is already running
  } else {
    // Socket is initializing
    const io = new Server(res.socket.server);

    const client = new Messaging.Client({
      project: process.env.PROJECT_ID,
      token: process.env.API_TOKEN,
      contexts: [process.env.CONTEXT],
    });

    // Sample message:
    //
    // {
    //   id: "message-uuid",
    //   state: "received",
    //   context: "office",
    //   from: "+100000003",
    //   to: "+17712093222",
    //   body: "Test",
    //   direction: "inbound",
    //   media: null,
    //   segments: 1,
    //   tags: [],
    // }

    /**
     *
     * @param {Messaging.MessageContract} message
     */
    function onMessageReceived(message) {
      // Mask sender number
      message.from =
        "+" + "x".repeat(message.from.length - 4) + message.from.slice(-3);
      console.log(message);

      // Notify the frontend
      io.emit("sms.received", message);
    }

    client.on("message.received", onMessageReceived);

    res.socket.server.io = io;
  }

  res.end();
}
