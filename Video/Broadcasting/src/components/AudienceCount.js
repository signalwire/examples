import { useEffect, useState } from "react";

export default function AudienceCount({ roomSession }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!roomSession) return;

    const onAudienceCount = (e) => {
      setCount(e.total);
    };
    roomSession.on("room.audience_count", onAudienceCount);

    return () => {
      roomSession.off("room.audience_count", onAudienceCount);
    };
  }, [roomSession]);

  return (
    <div style={{ marginBottom: "2em" }}>
      <span style={{ fontWeight: "bold" }}>Audience count:</span> {count}
    </div>
  );
}
