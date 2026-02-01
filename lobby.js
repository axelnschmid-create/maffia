const DEV_MODE = true;

let rolesConfig = {
  mafia: 1,
  police: 0,
  doctor: 0,
  citizen: 0
};


// ===== UI =====
function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (currentPhase === GamePhase.LOBBY) {
    renderLobby(app);
  }
}

function renderLobby(app) {
  const title = document.createElement("h2");
  title.textContent = "Lobby";
  app.appendChild(title);

  const input = document.createElement("input");
  input.placeholder = "Spelarnamn";
  app.appendChild(input);

  const addBtn = document.createElement("button");
  addBtn.textContent = "Lägg till spelare";
  addBtn.onclick = () => {
    if (input.value.trim() !== "") {
      players.push(new Player(input.value.trim()));
      input.value = "";
      render();
    }
  };
  app.appendChild(addBtn);

  const list = document.createElement("ul");
  players.forEach((player, index) => {
    const li = document.createElement("li");
    li.textContent = player.name;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.onclick = () => {
      players.splice(index, 1);
      render();
    };

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
  app.appendChild(list);

  const roleTitle = document.createElement("h3");
roleTitle.textContent = "Välj roller";
app.appendChild(roleTitle);

rolesConfig.citizen =
  players.length -
  rolesConfig.mafia -
  rolesConfig.police -
  rolesConfig.doctor;


function createRoleInput(labelText, key) {
  const wrapper = document.createElement("div");

  const label = document.createElement("label");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = "number";
  input.min = 0;
  input.value = rolesConfig[key];

  input.onchange = () => {
    rolesConfig[key] = Number(input.value);
  };

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  app.appendChild(wrapper);
}

createRoleInput("Maffia", "mafia");
createRoleInput("Polis", "police");
createRoleInput("Läkare", "doctor");
createRoleInput("Civila", "citizen");


  const startBtn = document.createElement("button");
  startBtn.textContent = "Starta spel";
  startBtn.disabled = players.length < 3;
  startBtn.onclick = startGame;
  app.appendChild(startBtn);
}

// ===== GAME LOGIC =====
function startGame() {
  const totalRoles =
    rolesConfig.mafia +
    rolesConfig.police +
    rolesConfig.doctor +
    rolesConfig.citizen;

  if (totalRoles !== players.length) {
    alert(
      `Antalet roller (${totalRoles}) måste vara lika med antal spelare (${players.length})`
    );
    return;
  }

  startRoles(rolesConfig);
}


// ===== INIT =====
if (DEV_MODE) {
  players = [
    new Player("Anna"),
    new Player("Erik"),
    new Player("Sara"),
    new Player("Johan"),
    new Player("Lisa")
  ];
}

render();


render();