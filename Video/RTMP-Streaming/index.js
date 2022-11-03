let roomSession;
let stream;

const stopStream = () => {
  if (stream) {
    stream.stop();
  }
};

const setRoomSession = (session) => {
  roomSession = session;

  document.getElementById("button-bar").style.display = "block";

  roomSession.on("room.left", () => {
    document.getElementById("button-bar").style.display = "none";

    stopStream();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("rtmp-form").onsubmit = async (e) => {
    e.preventDefault();

    const url = document.getElementById("stream-url").value;
    stream = await roomSession.startStream({ url });
  };

  document.getElementById("stop").onclick = (e) => {
    e.preventDefault();

    stopStream();
  };
});
