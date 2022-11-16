import "@signalwire/app-kit";
document.body.onload = addElement;

function addElement() {
  const roomSession = document.createElement("sw-video-conference");
  roomSession.setAttribute("token", "vpt_25e...8dd");
  roomSession.setAttribute("user-name", "Joe");
  roomSession.setAttribute("device-picker", "false");
  roomSession.setupRoomSession = (rs) => {
    console.log("Setting up Room Session", rs);

    rs.on("room.joined", (e) =>
      console.log("Joined room:", e.room.display_name)
    );
  };
  document.getElementById("app").append(roomSession);
}
