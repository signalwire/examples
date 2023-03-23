import React from "react";
import SplitButton from "./SplitButton";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import { useMembers, useWebRTC } from "@signalwire-community/react";

export default function MicrophoneButton({ roomSession }) {
  const { microphones } = useWebRTC({
    camera: false,
    microphone: true,
    speaker: false,
  });

  const { members } = useMembers(roomSession);

  const self = members.find((m) => m.id === roomSession?.memberId);

  return (
    <SplitButton
      muted={self?.audio.muted}
      mutedIcon={<MicOffIcon />}
      unmutedIcon={<MicIcon />}
      devices={microphones}
      onSetMuted={(muted) =>
        muted ? roomSession.audioMute() : roomSession.audioUnmute()
      }
      onDevicePicked={(deviceId) => roomSession.updateMicrophone({ deviceId })}
    />
  );
}
