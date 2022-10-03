import { PubSub, WebRTC } from "@signalwire/js";
import { useEffect, useState } from "react";

/*

curl -L -X POST 'https://<spacename>.signalwire.com/api/chat/tokens' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-u 'ProjectId:APIToken' \
--data-raw '{
  "ttl": 43200,
  "channels": {
    "my_live_stream": {
      "read": true,
      "write": false
    }
  },
  "member_id": "user",
  "state": {}
}'


*/

const token =
  "eyJ0eXAiOiJDUlQiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NjQ0NzEzMjIsImp0aSI6ImExMjJiMTliLTFmMjMtNGEwYy04OWQ2LTk2NzVhNGZmYmNlYiIsInN1YiI6IjdiOTgxZDA2LWZhOWUtNDM1Yy05YzJlLWIzMWUyOTVhYmQzYSIsInQiOjQzMjAwLCJjaGxzIjp7Im15X2xpdmVfc3RyZWFtIjp7InJlYWQiOnRydWUsIndyaXRlIjp0cnVlfX0sInN0dCI6e30sIm0iOiJ1c2VyIn0.ZaSiYDauuV9kh4SGqhJXV9LpQzLDQo3ykR0Kxi08gc86TtPqw5S_l4qwNdOsuWoz0BKb4GyW7UC2MoJTAXlAHg";

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

export function usePromotionRequests(roomSession) {
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
