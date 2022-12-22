import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import style from "./Prejoin.module.css";

export default function Prejoin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  async function onJoinClicked(mod) {
    const endpoint = mod ? "/get_member_token" : "/get_audience_token";
    const token = await fetch(`http://127.0.0.1:15000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: username,
        room_name: "my_live_stream",
      }),
    });

    navigate("/in-call", {
      state: {
        token: (await token.json()).token,
        userName: username,
      },
    });
  }

  return (
    <div className={style.container}>
      <div className={style.title}>My Live Stream</div>
      <div className={style.joinForm}>
        <TextField
          label="Your name"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className={style.joinButtons}>
          <Button variant="contained" onClick={() => onJoinClicked(false)}>
            Join as Audience
          </Button>
          <Button variant="outlined" onClick={() => onJoinClicked(true)}>
            Join as Moderator
          </Button>
        </div>
      </div>
    </div>
  );
}
