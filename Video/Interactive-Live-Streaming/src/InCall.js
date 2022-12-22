import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useStatus, Video } from "@signalwire-community/react";
import { useLocation } from "react-router-dom";
import Audience from "./components/Audience";
import AudienceCount from "./components/AudienceCount";
import CameraButton from "./components/CameraButton";
import LeaveButton from "./components/LeaveButton";
import Members from "./components/Members";
import MicrophoneButton from "./components/MicrophoneButton";
import { askPromotion, usePromotionSignal } from "./features/promotion";
import style from "./InCall.module.css";

export default function InCall() {
  const { state } = useLocation();
  const [roomSession, setRoomSession] = useState(null);
  const [memberType, setMemberType] = useState("member");
  const { active } = useStatus(roomSession);
  usePromotionSignal(roomSession);

  const token = state?.token;
  const userName = state?.userName;

  /**
   * Navigate back to the login page when leaving the room.
   */
  useEffect(() => {
    if (!roomSession) return;

    const onRoomLeft = () => {
      window.location.href = "/";
    };
    roomSession.on("room.left", onRoomLeft);

    return () => {
      roomSession?.off("room.left", onRoomLeft);
    };
  }, [roomSession]);

  /**
   * Navigate to the login page if no token was provided.
   */
  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }
  }, [token]);

  /**
   * Determine current member type (_internal api_, do not use)
   */
  useEffect(() => {
    setMemberType(roomSession?.select((s) => s?.session?.authState?.join_as));
  }, [roomSession, active]);

  /**
   * Detect promotions / demotions
   */
  useEffect(() => {
    if (!roomSession) return;

    const onMemberPromoted = (e) => {
      if (e.member_id === roomSession.memberId) {
        setMemberType("member");
      }
    };
    roomSession.on("member.promoted", onMemberPromoted);

    const onMemberDemoted = (e) => {
      if (e.member_id === roomSession.memberId) {
        setMemberType("audience");
      }
    };
    roomSession.on("member.demoted", onMemberDemoted);

    return () => {
      roomSession?.off("member.promoted", onMemberPromoted);
      roomSession?.off("member.demoted", onMemberDemoted);
    };
  }, [roomSession]);

  return (
    <div className={style.grid}>
      <div className={style.video}>
        <Video token={token} onRoomReady={setRoomSession} />
      </div>
      <div className={style.sidebar}>
        <Typography style={{ fontWeight: "bold" }}>Members</Typography>
        <Members roomSession={roomSession} />
        <AudienceCount roomSession={roomSession} />
        {memberType === "member" && (
          <>
            <Typography style={{ fontWeight: "bold" }}>
              Promotion requests
            </Typography>
            <Audience roomSession={roomSession} />
          </>
        )}
      </div>
      <div className={style.bottombar}>
        {active && (
          <div>
            <LeaveButton roomSession={roomSession} />
            {memberType === "member" && (
              <>
                <CameraButton roomSession={roomSession} />
                <MicrophoneButton roomSession={roomSession} />
              </>
            )}
            {memberType === "audience" && (
              <Button
                variant="contained"
                onClick={() => askPromotion(roomSession.memberId, userName)}
              >
                Ask Promotion
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
