import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function useMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    /** @type {import("socket.io-client").Socket} */
    let socket;
    let cancel = false;
    fetch("/api/socket").finally(() => {
      if (cancel) return;

      socket = io();

      socket.on("sms.received", (data) => {
        console.log(data);
        setMessages((m) => [...m, data]);
      });
    });

    return () => {
      cancel = true;
      socket?.disconnect();
    };
  }, []);

  return messages;
}
