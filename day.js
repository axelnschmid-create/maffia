// ===== DAY FLOW =====
function startDay() {
  currentPhase = GamePhase.DAY;
  renderDay();
}

// ===== UI =====
function renderDay() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Dag";
  app.appendChild(title);

  // Visa nattens offer
  const dead = players.filter(p => !p.isAlive);
  if (dead.length > 0) {
    const lastDead = dead[dead.length - 1];
    const info = document.createElement("p");
    info.textContent = `${lastDead.name} hittades död i morse.`;
    app.appendChild(info);
  } else {
    const info = document.createElement("p");
    info.textContent = "Ingen dog under natten.";
    app.appendChild(info);
  }

  // Lista levande spelare
  const aliveTitle = document.createElement("h3");
  aliveTitle.textContent = "Levande spelare:";
  app.appendChild(aliveTitle);

  const list = document.createElement("ul");
  players
    .filter(p => p.isAlive)
    .forEach(player => {
      const li = document.createElement("li");
      li.textContent = player.name;
      list.appendChild(li);
    });

  app.appendChild(list);

  // Fortsätt-knapp
  const btn = document.createElement("button");
  btn.textContent = "Gå till röstning";
  btn.onclick = startVoting;
  app.appendChild(btn);
}
