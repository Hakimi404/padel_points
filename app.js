const names = ["Wael", "Hakimi", "Mojahed", "Hamzah"];
let players = {};
let matchups = [];
let round = 0;
let history = [];
let started = false;

// init players
function initPlayers() {
  players = {};
  names.forEach(n => {
    players[n] = { r: 0, w: 0, l: 0, t: 0, p: 0 };
  });
}

// generate round-robin
function generateMatchups(list) {
  const res = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      res.push([list[i], list[j]]);
    }
  }
  return res;
}

function render() {
  roundBadge.innerText = started ? `Round ${round + 1}` : "Round –";

  if (started) {
    const [a, b] = matchups[round % matchups.length];
    playerA.innerText = a;
    playerB.innerText = b;
  }

  // leaderboard
  leaderboard.innerHTML = "";
  Object.entries(players)
    .sort((a, b) => b[1].p - a[1].p)
    .forEach(([n, s]) => {
      leaderboard.innerHTML += `
        <tr>
          <td>${n}</td>
          <td>${s.r}</td>
          <td>${s.w}</td>
          <td>${s.l}</td>
          <td>${s.t}</td>
          <td>${s.p}</td>
        </tr>`;
    });

  // history
  historyTable.innerHTML = "";
  history.forEach((h, i) => {
    historyTable.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${h.match}</td>
        <td>${h.score}</td>
        <td>${h.winner}</td>
      </tr>`;
  });
}

function nextRound() {
  if (round >= 40) return alert("Max 40 rounds reached");

  const a = Number(scoreA.value);
  const b = Number(scoreB.value);
  if (a + b !== 16) return alert("Total points must be 16");

  const [p1, p2] = matchups[round % matchups.length];

  players[p1].r++; players[p2].r++;
  players[p1].p += a; players[p2].p += b;

  let winner = "Tie";
  if (a > b) { players[p1].w++; players[p2].l++; winner = p1; }
  else if (b > a) { players[p2].w++; players[p1].l++; winner = p2; }
  else { players[p1].t++; players[p2].t++; }

  history.unshift({
    match: `${p1} vs ${p2}`,
    score: `${a} : ${b}`,
    winner
  });

  scoreA.value = "";
  scoreB.value = "";
  round++;
  render();
}

startBtn.onclick = () => {
  if (started) return;
  initPlayers();
  const shuffled = [...names].sort(() => Math.random() - 0.5);
  matchups = generateMatchups(shuffled);
  started = true;
  nextBtn.disabled = false;
  startBtn.disabled = true;
  render();
};

nextBtn.onclick = nextRound;

render();
