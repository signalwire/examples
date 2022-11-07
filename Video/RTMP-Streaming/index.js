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
    try {
      stream = await roomSession.startStream({ url });
      document.getElementById("streaming").style.display = "block";
      document.getElementById("start").style.display = "none";
      document.getElementById("stop").style.display = "inline";
    } catch (error) {
      console.log(error);
      alert(
        "There was an error starting the stream. Please check your URL and try again."
      );
    }
  };

  document.getElementById("stop").onclick = (e) => {
    e.preventDefault();
    try {
      stopStream();
      document.getElementById("streaming").style.display = "none";
      document.getElementById("start").style.display = "inline";
      document.getElementById("stop").style.display = "none";
    } catch (e) {
      console.log(e);
    }
  };
});
