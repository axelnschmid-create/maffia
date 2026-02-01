function showEndScreen(winnerText) {
  currentPhase = GamePhase.ENDED;

  const app = document.getElementById("app");
  app.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = winnerText;
  app.appendChild(title);

  const listTitle = document.createElement("h3");
  listTitle.textContent = "Spelare & roller:";
  app.appendChild(listTitle);

  const list = document.createElement("ul");

  players.forEach(player => {
    const li = document.createElement("li");
    li.textContent = `${player.name} – ${player.role}`;
    list.appendChild(li);
  });

  app.appendChild(list);

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "🔄 Reset spel";
  resetBtn.onclick = resetGame;
  app.appendChild(resetBtn);
}
