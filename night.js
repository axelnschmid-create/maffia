// ===== NIGHT STATE =====
let selectedVictim = null;
let policeTarget = null;
let doctorTarget = null;
let lastDoctorTarget = null;

// ===== NIGHT FLOW =====
function startNight() {
    doctorTarget = null;
    selectedVictim = null;

  currentPhase = GamePhase.NIGHT;

  showBetweenScreen(
    "Staden somnar...",
    renderNight
  );
}


// ===== UI =====
function renderNight() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Natt – Maffian vaknar";
  app.appendChild(title);

  const info = document.createElement("p");
  info.textContent = "Välj en spelare att eliminera:";
  app.appendChild(info);

  const list = document.createElement("ul");

  players
    .filter(p => p.isAlive)
    .forEach(player => {
      const li = document.createElement("li");

      const btn = document.createElement("button");
      btn.textContent = player.name;
      btn.onclick = () => selectVictim(player);

      li.appendChild(btn);
      list.appendChild(li);
    });

  app.appendChild(list);
}

function showBetweenScreen(text, onContinue) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const msg = document.createElement("h2");
  msg.textContent = text;
  app.appendChild(msg);

  const info = document.createElement("p");
  info.textContent = "Ge telefonen vidare och tryck fortsätt.";
  app.appendChild(info);

  const btn = document.createElement("button");
  btn.textContent = "Fortsätt";
  btn.onclick = onContinue;
  app.appendChild(btn);
}

function showSleepScreen(onContinue) {
  showBetweenScreen(
    "Alla somnar...",
    onContinue
  );
}

function showWakeScreen(onContinue) {
  showBetweenScreen(
    "Staden vaknar",
    onContinue
  );
}


function selectVictim(player) {
  selectedVictim = player;
  confirmVictim();
}

function confirmVictim() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const text = document.createElement("h2");
  text.textContent = `Maffian har valt ${selectedVictim.name}`;
  app.appendChild(text);

showBetweenScreen(
  "Maffian har gjort sitt.",
  startPolicePhase
);

}

function resolveNight() {

  startPolicePhase();
}

function startPolicePhase() {
  const police = players.find(p => p.role === Roles.POLICE);

  const app = document.getElementById("app");
  app.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Polisen vaknar";
  app.appendChild(title);

  // Om polisen är död
  if (!police || !police.isAlive) {
    showBetweenScreen(
      "Du är död och kan inte utföra din roll.",
      startDoctorPhase
    );
    return;
  }

  const info = document.createElement("p");
  info.textContent = "Välj en spelare att undersöka:";
  app.appendChild(info);

  const list = document.createElement("ul");

  players
    .filter(p => p.isAlive && p !== police)
    .forEach(player => {
      const btn = document.createElement("button");
      btn.textContent = player.name;
      btn.onclick = () => inspectPlayer(police, player);
      list.appendChild(btn);
    });

  app.appendChild(list);
}


function inspectPlayer(police, target) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const seenRole =
    target.role === Roles.MAFIA
      ? "Maffia"
      : "Civil";

  const text = document.createElement("h2");
  text.textContent = `${target.name} är ${seenRole}`;
  app.appendChild(text);

  const btn = document.createElement("button");
  btn.textContent = "Jag har sett";
  btn.onclick = () => {
    showBetweenScreen(
      "Polisen har gjort sitt.",
      startDoctorPhase
    );
  };

  app.appendChild(btn);
}



function startDoctorPhase() {
  doctorTarget = null;

  const doctor = players.find(p => p.role === Roles.DOCTOR);

  const app = document.getElementById("app");
  app.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Läkaren vaknar";
  app.appendChild(title);

  // Om läkaren är död
  if (!doctor || !doctor.isAlive) {
    showBetweenScreen(
      "Du är död och kan inte utföra din roll.",
      resolveDoctorPhase
    );
    return;
  }

  const info = document.createElement("p");
  info.textContent = "Välj en spelare att rädda:";
  app.appendChild(info);

  const list = document.createElement("ul");

  players
    .filter(p => p.isAlive)
    .forEach(player => {
      const btn = document.createElement("button");
      btn.textContent = player.name;

      if (player === lastDoctorTarget) {
        btn.disabled = true;
        btn.textContent += " (kan inte räddas igen)";
      } else {
        btn.onclick = () => {
          doctorTarget = player;
          resolveDoctorPhase();
        };
      }

      list.appendChild(btn);
    });

  app.appendChild(list);
}


function resolveDoctorPhase() {
  if (
    selectedVictim &&
    (!doctorTarget || doctorTarget !== selectedVictim)
  ) {
    selectedVictim.isAlive = false;

    if (checkWinCondition()) {
      return;
    }
  }

  // ✅ Spara vem läkaren räddade DENNA natt
  lastDoctorTarget = doctorTarget;

  // ✅ Nollställ natt-state
  doctorTarget = null;
  selectedVictim = null;

  showSleepScreen(() => {
    showWakeScreen(startDay);
  });
}



