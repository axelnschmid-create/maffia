// ===== MODELLER =====
class Player {
  constructor(name) {
    this.name = name;
    this.isAlive = true;
    this.role = null;
  }
}



const GamePhase = {
  LOBBY: "lobby",
  NIGHT: "night",
  DAY: "day",
  VOTING: "voting",
  ENDED: "ended"
};



let players = [];
let currentPhase = GamePhase.LOBBY;

function checkWinCondition() {
  const aliveMafia = players.filter(
    p => p.isAlive && p.role === Roles.MAFIA
  ).length;

  const aliveNonMafia = players.filter(
    p => p.isAlive && p.role !== Roles.MAFIA
  ).length;

  if (aliveMafia === 0) {
    showEndScreen("🎉 Civila vinner!");
    return true;
  }

  if (aliveMafia > aliveNonMafia) {
    showEndScreen("😈 Maffian vinner!");
    return true;
  }

  return false;
}


function resetGame() {
  players.forEach(p => {
    p.isAlive = true;
    delete p.role;
  });

  currentPhase = GamePhase.LOBBY;

  // om du kör DEV_MODE
  if (typeof DEV_MODE !== "undefined" && DEV_MODE) {
    // spelare finns kvar
  } else {
    players = [];
  }

  lastDoctorTarget = null;

  render();
}


