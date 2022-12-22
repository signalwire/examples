import { PubSub, WebRTC } from "@signalwire/js";
import { useEffect, useState } from "react";

let token = null;

/**
 * Get a chat token to use to exchange promotion request messages.
 * @returns
 */
const getToken = async () => {
  if (token) return token;

  const newtoken = await fetch(`http://127.0.0.1:15000/get_chat_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  token = (await newtoken.json()).token;
  return token;
};

export async function askPromotion(memberId, userName) {
  const pubSubClient = new PubSub.Client({ token });

  await pubSubClient.publish({
    channel: "my_live_stream",
    content: "ASK_PROMOTION",
    meta: {
      memberId,
      userName,
    },
  });
}

async function promoted(memberId, newMemberId, name) {
  const pubSubClient = new PubSub.Client({ token });

  await pubSubClient.publish({
    channel: "my_live_stream",
    content: "PROMOTED",
    meta: {
      memberId,
      newMemberId,
      name,
    },
  });
}

export function usePromotionRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    function handleMessage(message) {
      if (message.content === "ASK_PROMOTION") {
        setRequests((requests) =>
          uniqueById([
            ...requests,
            {
              id: message.meta.memberId,
              name: message.meta.userName,
            },
          ])
        );
      } else if (message.content === "PROMOTED") {
        setRequests((requests) => {
          const index = requests.findIndex(
            (r) =>
              r.id === message.meta.memberId ||
              r.id === message.meta.newMemberId ||
              r.name === message.meta.name
          );
          if (index > -1) {
            const reqs = [...requests];
            reqs.splice(index, 1);
            return reqs;
          }

          return requests;
        });
      }
    }

    const client = new PubSub.Client({ token });

    client.on("message", (msg) => handleMessage(msg));

    client.subscribe("my_live_stream");

    return () => {
      client.disconnect();
    };
  }, []);

  return requests;
}

/**
 * Ensures that when a user is promoted, it is cleared from the list of
 * promotion requests.
 */
export function usePromotionSignal(roomSession) {
  useEffect(() => {
    if (!roomSession) return;

    let beingPromoted = false;

    // Set default camera for promoted participants (just for demo purposes)
    const setDefaultCamera = async () => {
      if (!beingPromoted) return;

      const cameras = await WebRTC.getCameraDevices();
      const obs = cameras.find((c) => c.label.includes("OBS"));
      if (obs) {
        roomSession.updateCamera({ deviceId: obs.deviceId });
      }
    };

    const onMemberPromoted = (e) => {
      beingPromoted = true;
      promoted(e.member_id, roomSession.memberId, null);
    };
    roomSession.on("member.promoted", onMemberPromoted);

    const onMemberJoined = (e) => {
      setTimeout(() => setDefaultCamera(), 0);
      promoted(e.member.id, e.member.id, e.member.name);
    };
    roomSession.on("room.joined", onMemberJoined);

    return () => {
      roomSession.off("member.promoted", onMemberPromoted);
      roomSession.off("room.joined", onMemberJoined);
      roomSession.off("room.joined", setDefaultCamera);
    };
  }, [roomSession]);

  return null;
}

function uniqueById(arr) {
  return arr.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);
}
