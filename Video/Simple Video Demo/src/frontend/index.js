const $ = (x) => document.getElementById(x);

const removeAllButFirstOption = (x) => {
    while (x.childNodes.length > 1) {
        x.removeChild(x.lastChild);
    }
};

const backendurl = "";

let room;
let token;
let username;
let roomname;

// Simple js to control when forms appear
function gotopage(pagename) {
    if (pagename === "getusername") {
        $("getusername").style.display = "block";
        $("videoroom").style.display = "none";
        $("loading").style.display = "none";
    } else if (pagename === "videoroom") {
        $("getusername").style.display = "none";
        $("videoroom").style.display = "block";
        $("loading").style.display = "none";
    } else {
        $("getusername").style.display = "none";
        $("videoroom").style.display = "none";
        $("loading").style.display = "block";
    }
}

async function joinwithurl() {
    gotopage("loading");
    join();
}
async function join() {
    try {
        token = await axios.post(backendurl + "/get_token", {
            user_name: username,
            room_name: roomname
        });

        token = token.data.token;

        try {
            console.log("Setting up RTC session");
            try {
                room = new SignalWire.Video.RoomSession({
                    token,
                    rootElement: document.querySelector("#root")
                });
            } catch (e) {
                console.log(e);
            }
            room.on("room.joined", (e) => {
                logevent("You joined the room");
            });
            room.on("member.joined", (e) =>
                logevent(e.member.name + " has joined the room")
            );
            room.on("member.left", (e) =>
                logevent(e.member.id + " has left the room")
            );

            await room.join();
            populateLayout();
            populateCamera();
            populateMicrophone();
            generateInstantInviteLink();
        } catch (error) {
            console.error("Something went wrong", error);
        }

        gotopage("videoroom");
    } catch (e) {
        console.log(e);
        alert("Error encountered. Please try again.");
        gotopage("getusername");
    }
}

async function joinwithusername() {
    username = $("usernameinput").value.trim();
    roomname = $("roomnameinput").value.trim();
    if (roomname === "" || roomname === undefined) roomname = "signalwire";
    console.log("The user picked username", username);
    gotopage("loading");
    join();
}

async function hangup() {
    if (room) {
        await room.hangup();
        gotopage("getusername");
    }
}

function logevent(message) {
    $("events").innerHTML += "<br/>" + message;
}

//Start
gotopage("getusername");

const urlParams = new URL(document.location).searchParams;
// console.log(urlParams);
console.log(urlParams.get("r"));
if (urlParams.has("r") && urlParams.get("r") !== "") {
    console.log("From URL", urlParams.get("r"));
    roomname = atob(decodeURIComponent(urlParams.get("r")));
    username = Math.random().toString(36).substring(7);
    gotopage("loading");
    joinwithurl();
}

let screenShareObj;
async function share_screen() {
    if (room === undefined) return;
    if (screenShareObj === undefined) {
        screenShareObj = await room.createScreenShareObject();
        $("share_screen_button").innerText = "Turn off Sharing";
    } else {
        screenShareObj.leave();
        screenShareObj = undefined;
        $("share_screen_button").innerText = "Share Screen";
    }
}

// To Change the video call's layout

async function populateLayout() {
    removeAllButFirstOption($("layout_select"));
    $("layout_select").addEventListener("change", async (e) => {
        console.log(e.target.value);
        // toggle_layout(e.target.value);
        await room.setLayout({ name: e.target.value });
        $("layout_indicator").innerText = e.target.value;
    });
    if (room === undefined) return;
    let layouts = await room.getLayoutList();
    layouts.layouts.forEach((layout) => {
        let child = document.createElement("option");
        child.innerText = layout;
        child.value = layout;
        $("layout_select").appendChild(child);
    });
}

// Events for buttons

let audio_muted = false;
$("audio_mute").addEventListener("click", async (e) => {
    if (!room) return;
    if (audio_muted) {
        await room.audioUnmute();
        audio_muted = false;
        $("audio_mute").innerText = "Mute Audio";
    } else {
        await room.audioMute();
        audio_muted = true;
        $("audio_mute").innerText = "Unmute Audio";
    }
});

let video_muted = false;
$("video_mute").addEventListener("click", async (e) => {
    if (!room) return;
    if (video_muted) {
        await room.videoUnmute();
        video_muted = false;
        $("video_mute").innerText = "Mute Video";
    } else {
        await room.videoMute();
        video_muted = true;
        $("video_mute").innerText = "Unmute Video";
    }
});

async function populateCamera() {
    let cams = await SignalWire.WebRTC.getCameraDevicesWithPermissions();

    removeAllButFirstOption($("camera_select"));
    cams.forEach((cam) => {
        let child = document.createElement("option");
        child.innerText = cam.label;
        child.value = cam.deviceId;
        $("camera_select").appendChild(child);
    });

    $("camera_select").onchange = async (e) => {
        console.log(e.target.value);
        room.updateCamera({ deviceId: e.target.value });
    };
}
async function populateMicrophone() {
    let mics = await SignalWire.WebRTC.getMicrophoneDevicesWithPermissions();

    removeAllButFirstOption($("microphone_select"));
    mics.forEach((mic) => {
        let child = document.createElement("option");
        child.innerText = mic.label;
        child.value = mic.deviceId;
        $("microphone_select").appendChild(child);
    });

    $("microphone_select").onchange = async (e) => {
        console.log(e.target.value);
        room.updateMicrophone({ deviceId: e.target.value });
    };
}

function generateInstantInviteLink() {
    console.log("generating");
    let curURL = new URL(window.location.href);
    curURL.searchParams.set("r", encodeURIComponent(btoa(roomname)));
    $("instant_invite").innerText = curURL.toString();
    console.log(curURL);
}
