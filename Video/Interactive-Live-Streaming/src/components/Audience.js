import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Tooltip } from "@mui/material";
import { usePromotionRequests } from "../features/promotion";
import style from "./Audience.module.css";

export default function Audience({ roomSession }) {
  const promotionRequests = usePromotionRequests(roomSession);

  return (
    <div className={style.container}>
      {promotionRequests?.map((member) => (
        <div key={member.id}>
          <span>{member.name}</span>
          <SmallPromoteButton roomSession={roomSession} member={member} />
        </div>
      ))}
    </div>
  );
}

function SmallPromoteButton({ roomSession, member }) {
  return (
    <Tooltip title="Promote">
      <IconButton
        size="small"
        color="primary"
        onClick={() =>
          roomSession?.promote({
            memberId: member.id,
            joinAudioMuted: true,
            permissions: [
              "room.self.audio_mute",
              "room.self.audio_unmute",
              "room.self.video_mute",
              "room.self.video_unmute",
              "room.self.deaf",
              "room.self.undeaf",
              "room.self.set_input_volume",
              "room.self.set_output_volume",
              "room.self.set_input_sensitivity",
              "room.self.set_meta",
              "room.member.demote",
              "room.member.promote",
              "room.member.set_meta",
              "room.member.remove",
            ],
          })
        }
      >
        <ArrowUpwardIcon />
      </IconButton>
    </Tooltip>
  );
}
