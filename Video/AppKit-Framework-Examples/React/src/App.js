import React, { useLayoutEffect, useRef } from "react";
import "./App.css";
import "@signalwire/app-kit";

function App() {
  const videoComponent = useRef();

  useLayoutEffect(() => {
    if (videoComponent.current) {
      videoComponent.current.setupRoomSession = (rs) => {
        console.log("Setting up Room Session");

        rs.on("room.joined", (e) =>
          console.log("Joined room:", e.room_session.name)
        );
      };
    }
  }, []);

  return (
    <div className="App">
      <sw-video-conference
        token="vpt_25e67aace53a906f8387f2f499e9d8dd"
        user-name="Guest"
        device-picker={true}
        ref={videoComponent}
      />
    </div>
  );
}

export default App;
