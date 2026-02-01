let atmosphereMusic = null;

function startAtmosphereMusic() {
  if (!atmosphereMusic) {
    atmosphereMusic = new Audio("Ljud/bakgrundsmusik.m4a");
    atmosphereMusic.loop = true;
    atmosphereMusic.volume = 0.4; // lagom bakgrund
  }

  atmosphereMusic.currentTime = 0;
  atmosphereMusic.play();
}

function stopAtmosphereMusic() {
  if (atmosphereMusic) {
    atmosphereMusic.pause();
    atmosphereMusic.currentTime = 0;
  }
}



// ===== ROLLER =====
const Roles = {
  MAFIA: "Maffia",
  POLICE: "Polis",
  DOCTOR: "Läkare",
  CITIZEN: "Civil"
};




let roleIndex = 0;
let shuffledPlayers = [];

// ===== START ROLE FLOW =====
function startRoles(config) {
  startAtmosphereMusic();
  roleIndex = 0;
  assignRoles(config);
  showNextPlayer();
}


function assignRoles(config) {
  shuffledPlayers = [...players];

  // skapa roll-lista
  const rolePool = [];

  for (let i = 0; i < config.mafia; i++) rolePool.push(Roles.MAFIA);
  for (let i = 0; i < config.police; i++) rolePool.push(Roles.POLICE);
  for (let i = 0; i < config.doctor; i++) rolePool.push(Roles.DOCTOR);
  for (let i = 0; i < config.citizen; i++) rolePool.push(Roles.CITIZEN);

  // säkerhet (ska aldrig trigga pga lobby-check)
  if (rolePool.length !== players.length) {
    alert("Fel i roll-konfiguration");
    return;
  }

  // blanda roller
  rolePool.sort(() => Math.random() - 0.5);

  // tilldela
  shuffledPlayers.forEach((player, index) => {
    player.role = rolePool[index];
  });
}



// ===== UI FLOW =====
function showNextPlayer() {
  const app = document.getElementById("app");
  app.innerHTML = "";

if (roleIndex >= shuffledPlayers.length) {
  startNightFromRoles();
  return;
}


  const player = shuffledPlayers[roleIndex];

  const title = document.createElement("h2");
  title.textContent = `Ge telefonen till ${player.name}`;
  app.appendChild(title);

  const btn = document.createElement("button");
  btn.textContent = "Visa roll";
  btn.onclick = () => showRole(player);
  app.appendChild(btn);
}

function showRole(player) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const roleText = document.createElement("h2");
  roleText.textContent = `Din roll är: ${player.role}`;
  app.appendChild(roleText);

  const btn = document.createElement("button");
  btn.textContent = "Dölj och lämna vidare";
  btn.onclick = () => {
    roleIndex++;
    showNextPlayer();
  };
  app.appendChild(btn);
}



// ===== NEXT PHASE =====
function startNightFromRoles() {
  startNight();
}


function startNight() {
  stopAtmosphereMusic();
  currentPhase = GamePhase.NIGHT;
  alert("Alla roller utdelade. Natten börjar.");
  startNight();
}
