import React from "react";
import SplitButton from "./SplitButton";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useMembers, useWebRTC } from "@signalwire-community/react";

export default function CameraButton({ roomSession }) {
  const { cameras } = useWebRTC({
    camera: true,
    microphone: false,
    speaker: false,
  });

  const { members } = useMembers(roomSession);

  const self = members.find((m) => m.id === roomSession?.memberId);

  return (
    <SplitButton
      muted={self?.video.muted}
      mutedIcon={<VideocamOffIcon />}
      unmutedIcon={<VideocamIcon />}
      devices={cameras}
      onSetMuted={(muted) =>
        muted ? roomSession.videoMute() : roomSession.videoUnmute()
      }
      onDevicePicked={(deviceId) => roomSession.updateCamera({ deviceId })}
    />
  );
}
