import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useMembers } from "@signalwire-community/react";
import { Tooltip } from "@mui/material";
import style from "./Members.module.css";

export default function Members({ roomSession }) {
  const { members } = useMembers(roomSession);

  return (
    <div className={style.container}>
      {members?.map((member) => (
        <div key={member.id}>
          <span>{member.name}</span>
          <SmallDemoteButton roomSession={roomSession} member={member} />
          <SmallLeaveButton roomSession={roomSession} member={member} />
        </div>
      ))}
    </div>
  );
}

function SmallLeaveButton({ roomSession, member }) {
  return (
    <Tooltip title="Remove">
      <IconButton
        size="small"
        color="primary"
        onClick={() => roomSession?.removeMember({ memberId: member.id })}
      >
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
}

function SmallDemoteButton({ roomSession, member }) {
  return (
    <Tooltip title="Demote to Audience">
      <IconButton
        size="small"
        color="primary"
        onClick={() => roomSession?.demote({ memberId: member.id })}
      >
        <ArrowDownwardIcon />
      </IconButton>
    </Tooltip>
  );
}
