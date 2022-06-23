const appEl = document.getElementById("app")

let selectionType = ""

function goToLoginPage() {
    appEl.innerHTML = document.getElementById("loginPage").innerHTML

    const memberEl = appEl.querySelector("#username")
    const channelsEl = appEl.querySelector("#channels")

    appEl.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault()
        goToChatPage(memberEl.value, channelsEl.value)
    })
}


async function goToChatPage(member, channels) {

    appEl.innerHTML = document.getElementById("chatPage").innerHTML

    const channelsContainerEl = document.querySelector("#channelsContainer")
    const messageToSendEl = document.querySelector("#messageToSend")
    const dropdownContainerEl = document.querySelector(".dropdown ul")

    let isCurrentlyTyping = false

    const channelDiv = {};

    const typingMemberIds = new Set();

    const reply = await axios.post("/get_chat_token", {
        member_id: member,
        channels: channels
    })

    const token = reply.data.token

    const chatClient = new SignalWire.Chat.Client({
        token: token
    })

    window.chatClient = chatClient;

    async function displayMessage(message, channel) {

        const messageListEl = channelDiv[channel].querySelector(".messages-list")
        const messageEl = document.createElement("div")
        messageEl.classList.add("message")
        messageEl.innerHTML = `
             <div class="message-meta"></div>
             <div class="message-body"></div>
        `
        messageEl.querySelector(".message-meta").innerText = `${
            message.member.id
        } (${message.publishedAt.toLocaleString()})`

        messageEl.querySelector(".message-body").innerText = message.content
        messageListEl.append(messageEl)

        messageEl.scrollIntoView(false)
    }

    async function downloadExistingMessages(channel) {
        const messages = await chatClient.getMessages({
            channel: channel
        });

        if (!messages?.messages) return;

        for (const msg of messages.messages.reverse()) {
            displayMessage(msg, channel)
        }
    }

    const typingTimeout = debounce(() => {
        chatClient.setMemberState({
            channels: channels,
            state: {
                typing: false
            }
        });

        isCurrentlyTyping = false
    }, 1000)

    function userTyping() {
        if (!isCurrentlyTyping) {
            isCurrentlyTyping = true
            chatClient.setMemberState({
                channels: channels,
                state: {
                    typing: true
                }
            })
        }

        typingTimeout()
    }

    async function sendMessage(channel) {

        const message = messageToSendEl.value;


        if (message.toLowerCase() === "start") {
            await chatClient.publish({
                channel: channel,
                content: message
            })

            const introMessage = `
                Enter 1 to send an SMS message
                Enter 2 to make a Voice call
            `
            await chatClient.publish({
                channel: channel,
                content: introMessage
            })
        }
        if (message === "1") {
            await chatClient.publish({
                channel: channel,
                content: message
            })

            selectionType = message

            const messageSelection = `
                \tYou selected Message\n
                Enter the from, to and content parameter using the below format\n
                (ex. +1aaabbbcccc,+1xxxyyyzzzz,"Hello world")
            `

            await chatClient.publish({
                channel: channel,
                content: messageSelection
            })
        } else if (message === "2") {

            selectionType = message

            await chatClient.publish({
                channel: channel,
                content: message
            })

            const voiceSelection = `
                \tYou selected Voice\n
                Enter the from, to, content parameter using the below format\\n
                (ex. +1aaabbbcccc,+1xxxyyyzzzz, "Say hello world!")
            `

            await chatClient.publish({
                channel: channel,
                content: voiceSelection
            })
        }else{

            if (selectionType === "1"){

                let data = message.trim().split(",")
                let from = data[0]
                let to = data[1]
                let content = data[2]

                await chatClient.publish({
                    channel: channel,
                    content: message
                })

                sendSWMessage(from, to, content, channel, chatClient)

            }else if (selectionType === "2"){

                let data = message.trim().split(",")
                let from = data[0]
                let to = data[1]
                let content = data[2]

                await chatClient.publish({
                    channel: channel,
                    content: message
                })

                makeCall(from, to, content, channel, chatClient)

            }else if (selectionType === ""){
                console.log("Invalid selection")
            }

        }

        messageToSendEl.value = ""

    }

    // intialize the UI
    for (const channel of channels.split(",")) {
        const channelEl = document.createElement("div")
        channelEl.classList.add("channel")
        channelEl.innerHTML = `
            <div class="channel-name"></div>
            <div class="messages-list"></div>
        `

        channelEl.querySelector(".channel-name").innerText = channel
        channelsContainerEl.append(channelEl)
        channelDiv[channel] = channelEl

        const channelMenuEl = document.createElement("li")
        channelMenuEl.innerHTML = `
            <a class="dropdown-item" href="#"></a>
        `
        channelMenuEl.querySelector("a").innerText = channel;
        channelMenuEl.querySelector("a").addEventListener("click", () => sendMessage(channel))
        dropdownContainerEl.append(channelMenuEl)
    }

    messageToSendEl.addEventListener("keyup", userTyping)

    for (const channel of channels.split(",")) {
        downloadExistingMessages(channel)
    }

    chatClient.on("message", (message) => {
        displayMessage(message, message.channel)
    })

    chatClient.on("member.updated", (member) => {
        if (member.state?.typing) {
            typingMemberIds.add(member.id)
        } else {
            typingMemberIds.delete(member.id)
        }

        const typingEl = document.querySelector("#typing")
        const memberStr = Array.from(typingMemberIds).join(", ")

        if (typingMemberIds.size === 0) {
            typingEl.innerText = ""
        } else if (typingMemberIds === 1) {
            typingEl.innerText = memberStr + "is typing..."
        } else {
            typingEl.innerText = memberStr + " are typing..."
        }
    })

    chatClient.subscribe(channels)

}

async function sendSWMessage(from, to, content, channel, chatClient) {

    if (from !== "" && to !== "" && content !== "") {

        try {
            const body = {
                from: from,
                to: to,
                content: content
            }

            const result = await axios.post("/send_message", body)
            await chatClient.publish({
                channel: channel,
                content: "Message sent successfully!\n\nPress start to get-started"
            })
        } catch (e) {
            console.log(e)
        }
    }

}

async function makeCall(from, to, content,  channel, chatClient){
    if (from !== "" && to !== "" ){
        try{

            const body = {
                from: from,
                to: to
            }

            const result = await axios.post("/make_call", body)

            await chatClient.publish({
                channel: channel,
                content: "Call initiated successfully!\n\nPress start to get-started"
            })

        }catch (e){
            console.log(e)
        }
    }
}

goToLoginPage()