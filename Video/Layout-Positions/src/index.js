import "./styles.css";

/**
 * Populate the layout selector, and handle layout changes.
 */
async function populateLayouts(roomSession) {
  const layoutSelect = document.getElementById('layout_select')
  layoutSelect.innerHTML = `<option value="" disabled selected hidden>Change Layout</option>`

  layoutSelect.addEventListener("change", async (e) => {
    await roomSession.setLayout({ name: e.target.value });
  });

  roomSession.on('room.joined', async (e) => {
    const layouts = await roomSession.getLayouts();
    layouts.layouts.forEach((layout) => {
      const child = document.createElement("option");
      child.innerText = layout;
      child.value = layout;
      layoutSelect.appendChild(child);
    });
  })

  roomSession.on("layout.changed", e => {
    layoutSelect.value = e.layout.name;
  })
}

/**
 * Populate the positions selector, and handle position changes.
 */
async function populatePositions(roomSession) {
  const memberSelect = document.getElementById('pos_member_select')
  const positionSelect = document.getElementById('pos_pos_select')

  positionSelect.addEventListener("change", async (e) => {
    if (e.target.value && memberSelect.value) {
      roomSession.setMemberPosition({
        memberId: memberSelect.value,
        position: positionSelect.value
      })

      positionSelect.value = ""
    }
  })

  roomSession.on("layout.changed", e => {
    positionSelect.innerHTML = `
      <option value="" disabled selected hidden>Select a Position</option>
      <option value="auto">auto</option>
      <option value="off-canvas">off-canvas</option>
    `

    e.layout.layers.forEach((layer) => {
      if (layer.position.startsWith("reserved-") || layer.position.startsWith("standard-")) {
        const child = document.createElement("option");
        child.innerText = layer.position;
        child.value = layer.position;
        positionSelect.appendChild(child);
      }
    })
  })
}

/**
 * Populate the members selector.
 */
async function populateMembers(members) {
  const memberSelect = document.getElementById('pos_member_select')
  const currValue = memberSelect.value
  
  memberSelect.innerHTML = `<option value="" disabled selected hidden>Select a Member</option>`

  for (const member of members) {
    let child = document.createElement("option");
    child.innerText = member.name;
    child.value = member.id;
    memberSelect.appendChild(child)
  }

  memberSelect.value = currValue
}

window.roomSessionReady = (roomSession) => {
  console.log(roomSession)
  populatePositions(roomSession)
  populateLayouts(roomSession)

  roomSession.on('room.joined', async (e) => {
    populateMembers(e.room.members)
  })

  roomSession.on('memberList.updated', (e) => {
    populateMembers(e.members)
  })
}

function showPage(page) {
  const template = document.getElementById(`page-${page}`);
  const clone = template.content.cloneNode(true);
  const app = document.getElementById('app')
  app.innerHTML = ''
  app.appendChild(clone)
}

/**
 * Shows the Login page
 */
function showLoginPage() {
  showPage('login')

  document.getElementById('btn-login').addEventListener('click', () => {
    window.userName = document.getElementById('username').value
    showInCallPage()
  })
}

/**
 * Shows the "incall" page
 */
function showInCallPage() {
  showPage('incall')
}

showLoginPage()