// ===== VOTING FLOW =====
function startVoting() {
  currentPhase = GamePhase.VOTING;
  renderVoting();
}

// ===== UI =====
function renderVoting() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Röstning";
  app.appendChild(title);

  const info = document.createElement("p");
  info.textContent = "Välj en spelare att rösta ut:";
  app.appendChild(info);

  const list = document.createElement("ul");

  players
    .filter(p => p.isAlive)
    .forEach(player => {
      const li = document.createElement("li");

      const btn = document.createElement("button");
      btn.textContent = player.name;
      btn.onclick = () => voteOut(player);

      li.appendChild(btn);
      list.appendChild(li);
    });

  app.appendChild(list);

const skipBtn = document.createElement("button");
skipBtn.textContent = "Skippa röstning";
skipBtn.onclick = skipVoting;
app.appendChild(skipBtn);


}


// ===== LOGIC =====
function voteOut(player) {
  player.isAlive = false;

  if (checkWinCondition()) {
    return;
  }

  showBetweenScreen(
    `${player.name} blev utröstad.`,
    startNight
  );
}


function skipVoting() {
  showBetweenScreen(
    "Ingen blev utröstad.",
    startNight
  );
}
