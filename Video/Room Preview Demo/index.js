require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT ?? 3000;
const axios = require("axios");

const { PROJECT_ID, API_TOKEN, SPACE_URL } = process.env;
const auth = { username: PROJECT_ID, password: API_TOKEN };

app.get("/thumbURL", async (req, res) => {
  console.log(
    SPACE_URL + "/api/video/room_sessions?page_size=100&status=in-progress"
  );
  try {
    let roomsessions = await axios.get(
      "https://" +
        SPACE_URL +
        "/api/video/room_sessions?page_size=100&status=in-progress",
      { auth }
    );
    console.log(roomsessions.data.data);
    let thumbroom = roomsessions.data.data.find(
      (x) => x.room_id === "3c1e815c-3b3f-4bc5-a200-107ab367a924"
    );
    res.json(thumbroom);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.use("/", express.static("static"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
