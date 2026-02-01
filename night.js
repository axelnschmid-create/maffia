// ===== NIGHT STATE =====
let selectedVictim = null;
let policeTarget = null;
let doctorTarget = null;
let lastDoctorTarget = null;

const sounds = {
  bakgrund: new Audio("Bakgrundsmusik.m4a"),
  police: new Audio("Polisen.m4a"),
  doctor: new Audio("Lakaren.m4a"),
  maffiaupp: new Audio("Maffianupp.m4a"),
  maffianer: new Audio("Maffianner.m4a"),
  StadenVaknar: new Audio("Stadenvaknar.m4a")
};


// ===== NIGHT FLOW =====
function startNight() {
    startAtmosphereMusic();
    doctorTarget = null;
    selectedVictim = null;

  currentPhase = GamePhase.NIGHT;

showBetweenScreen(
  "Staden somnar...",
  "maffiaupp",
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

function showBetweenScreen(text, soundKey, onContinue) {
  // 👇 stöd för gamla anrop (2 argument)
  if (typeof soundKey === "function") {
    onContinue = soundKey;
    soundKey = null;
  }

  const app = document.getElementById("app");
  app.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.textContent = text;
  app.appendChild(h2);

  const p = document.createElement("p");
  p.textContent = "Tryck på fortsätt och stäng dina ögon, du har 5 sekunder på dig efter du trycker på fortsätt";
  app.appendChild(p);

  const btn = document.createElement("button");
  btn.textContent = "Fortsätt";

  btn.onclick = () => {
    let seconds = 5;
    p.textContent = `Nästa roll vaknar om ${seconds}…`;

    const interval = setInterval(() => {
      seconds--;
      p.textContent = `Nästa roll vaknar om ${seconds}…`;

      if (seconds === 0) {
        clearInterval(interval);

        if (soundKey && sounds[soundKey]) {
          sounds[soundKey].play();
        }

        if (typeof onContinue === "function") {
          onContinue();
        }
      }
    }, 1000);
  };

  app.appendChild(btn);
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
  "police",
  startPolicePhase
);


}

function resolveNight() {

  waitAndPlay("police", startPolicePhase);

}

function startPolicePhase() {
  const police = players.find(p => p.role === Roles.POLICE);

  if (!police) {
    waitAndPlay("doctor", startDoctorPhase);
    return;
  }
  
  const app = document.getElementById("app");
  app.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Polisen vaknar";
  app.appendChild(title);

  // Om polisen är död
  if (!police || !police.isAlive) {
    showBetweenScreen(
      "Du är död och kan inte utföra din roll.",
      waitAndPlay("doctor", startDoctorPhase)
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
  "doctor",
  startDoctorPhase
);

  };

  app.appendChild(btn);
}



function startDoctorPhase() {
  doctorTarget = null;

  const doctor = players.find(p => p.role === Roles.DOCTOR);

  if (!doctor) {
    resolveDoctorPhase();
    return;
  }

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

    showBetweenScreen(
      "Läkaren har gjort sitt",
      "StadenVaknar",
      startDay
    );


}



