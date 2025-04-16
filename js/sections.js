const BASE_URL = "http://localhost:8080";

// Unified API functions
function fetchGames() {
  return fetch(`${BASE_URL}/games`).then(res => res.json());
}
function fetchPlayer(fName, lName) {
  return fetch(`${BASE_URL}/players/search?fName=${fName}&lName=${lName}`).then(res => res.json());
}
function fetchPerformance(fName, lName) {
  return fetch(`${BASE_URL}/performances/search?fName=${fName}&lName=${lName}`).then(res => res.json());
}
function fetchGameById(gameId) {
  return fetch(`${BASE_URL}/games/${gameId}`).then(res => res.json());
}
function postDelivery(delivery) {
  return fetch(`${BASE_URL}/deliveries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(delivery)
  }).then(res => {
    if (!res.ok) throw new Error("Failed to add delivery");
    return res.json();
  });
}

// Section router
function showSection(section) {
  const container = document.getElementById("main-content");
  container.innerHTML = "";

  switch (section) {
    case 'home':
    case 'allMatches':
        console.log("Home section triggered")
      const title = section === 'home' ? "Live Matches" : "All Matches";
      container.innerHTML = `<h2>${title}</h2><p>Loading...</p>`;
      fetchGames()
        .then(games => renderGames(container, games, title))
        .catch(err => {
          console.error(err);
          container.innerHTML = `<p style="color:red;">Error loading ${title.toLowerCase()}. ${err.message}</p>`;
        });
      break;

    case 'profile':
      container.innerHTML = `
        <h2>Search Player Profile</h2>
        <input type="text" id="fNameInput" placeholder="First Name" />
        <input type="text" id="lNameInput" placeholder="Last Name" />
        <button onclick="searchPlayer()">Search</button>
        <div id="profileResult" style="margin-top: 1rem;"></div>
      `;
      break;

    case 'performance':
      container.innerHTML = `
        <h2>Search Player Performance</h2>
        <input type="text" id="perfFName" placeholder="First Name" />
        <input type="text" id="perfLName" placeholder="Last Name" />
        <button onclick="searchPerformance()">Search</button>
        <div id="performanceResult" style="margin-top: 1rem;"></div>
      `;
      break;

    case 'scorer':
      container.innerHTML = `
        <h2>Scorer - Add Delivery</h2>
        <form id="scorerForm">
          <input type="number" id="inningId" placeholder="Inning ID" required /><br />
          <input type="number" id="batsmanId" placeholder="Batsman ID" required /><br />
          <input type="number" id="bowlerId" placeholder="Bowler ID" required /><br />
          <input type="number" id="nonStrikerId" placeholder="Non-Striker ID (optional)" /><br />
          <input type="number" id="fielderId" placeholder="Fielder ID (optional)" /><br />
          <input type="number" id="runsScored" placeholder="Runs Scored" required /><br />
          <label><input type="checkbox" id="isWicket" /> Wicket</label><br />
          <input type="text" id="dismissalType" placeholder="Dismissal Type (if out)" /><br />
          <input type="number" id="ballNumber" placeholder="Ball Number" required /><br />
          <input type="number" id="overNumber" placeholder="Over Number" required /><br />
          <label><input type="checkbox" id="wideOrNoBall" /> Wide or No Ball</label><br /><br />
          <button type="submit">Add Delivery</button>
        </form>
        <div id="scorerResult" style="margin-top:1rem;"></div>
      `;
      document.getElementById("scorerForm").onsubmit = function (e) {
        e.preventDefault();
        const delivery = {
          inning: { inningId: parseInt(document.getElementById("inningId").value) },
          batsman: { playerId: parseInt(document.getElementById("batsmanId").value) },
          bowler: { playerId: parseInt(document.getElementById("bowlerId").value) },
          nonStriker: document.getElementById("nonStrikerId").value ? { playerId: parseInt(document.getElementById("nonStrikerId").value) } : null,
          fielder: document.getElementById("fielderId").value ? { playerId: parseInt(document.getElementById("fielderId").value) } : null,
          runsScored: parseInt(document.getElementById("runsScored").value),
          isWicket: document.getElementById("isWicket").checked,
          dismissalType: document.getElementById("dismissalType").value || null,
          ballNumber: parseInt(document.getElementById("ballNumber").value),
          overNumber: parseInt(document.getElementById("overNumber").value),
          wideOrNoBall: document.getElementById("wideOrNoBall").checked
        };
        postDelivery(delivery)
          .then(data => {
            document.getElementById("scorerResult").innerHTML = `<p style="color:green;">Delivery added successfully! ID: ${data.deliveryId}</p>`;
          })
          .catch(err => {
            document.getElementById("scorerResult").innerHTML = `<p style="color:red;">${err.message}</p>`;
          });
      };
      break;
  }
}

// Renders games into clickable cards
function renderGames(container, games, title = "Matches") {
    if (!games.length) {
      container.innerHTML = `<p>No ${title.toLowerCase()} found.</p>`;
      return;
    }
  
    container.innerHTML = `<h2>${title}</h2>`;
  
    games.forEach((game) => {
      console.log("Full game object:", game); // For debugging
  
      const gameId = game.gameId;
      if (!gameId) {
        console.warn("Missing gameId for game:", game);
        return;
      }
  
      const card = document.createElement("div");
      card.className = "match-card";
      card.dataset.gameId = gameId;
  
      card.addEventListener("click", () => {
        console.log("Clicked gameId:", gameId);
        showMatchCenter(gameId);
      });
  
      card.innerHTML = `
        <p><strong>Venue:</strong> ${game.venue || "N/A"}</p>
        <p><strong>Type:</strong> ${game.type || "N/A"}</p>
        <p><strong>Date:</strong> ${game.date ? new Date(game.date).toLocaleString() : "N/A"}</p>
        <p><strong>Umpire:</strong> ${game.umpire || "N/A"}</p>
      `;
  
      container.appendChild(card);
    });
  }
  
  function showMatchCenter(matchId) {
    fetchGameById(matchId)
      .then(match => {
        const container = document.getElementById("main-content");
        if (!match || !match.gameId) {
          container.innerHTML = "<p>Match data unavailable.</p>";
          return;
        }
  
        container.innerHTML = `
          <h2>Match Center</h2>
          <div class="tab-container">
            <button onclick="showTab('summary', ${matchId})">Summary</button>
            <button onclick="showTab('scorecard', ${matchId})">Scorecard</button>
            <button onclick="showTab('squads', ${matchId})">Squads</button>
            <button onclick="showTab('highlights', ${matchId})">Highlights</button>
            <button onclick="showTab('balls', ${matchId})">Deliveries</button>
            <button onclick="showTab('points', ${matchId})">Points Table</button>
            <button onclick="showTab('info', ${matchId})">Match Info</button>
          </div>
          <div id="match-tab-content"></div>
        `;
  
        showTab("summary", matchId); // default tab
      })
      .catch(err => {
        document.getElementById("main-content").innerHTML = `<p style="color:red;">${err.message}</p>`;
      });
  }
  
  function showTab(tab, matchId) {
    const content = document.getElementById("match-tab-content");
    content.innerHTML = "Loading...";
  
    if (tab === "info") {
      fetchGameById(matchId)
        .then(game => {
          content.innerHTML = `
            <h3>Match Info</h3>
            <p><strong>Title:</strong> ${game.type}</p>
            <p><strong>Date:</strong> ${new Date(game.date).toLocaleString()}</p>
            <p><strong>Venue:</strong> ${game.venue}</p>
            <p><strong>Umpire:</strong> ${game.umpire}</p>
          `;
        })
        .catch(err => {
          content.innerHTML = `<p style="color:red;">Failed to load info: ${err.message}</p>`;
        });
    } else {
      content.innerHTML = `<p>${tab} section is under construction.</p>`;
    }
  }
  
// Player/Performance
function searchPlayer() {
  const fName = document.getElementById("fNameInput").value.trim();
  const lName = document.getElementById("lNameInput").value.trim();
  const resultDiv = document.getElementById("profileResult");

  if (!fName || !lName) {
    resultDiv.innerHTML = `<p style="color:red;">Please enter both first and last name.</p>`;
    return;
  }

  resultDiv.innerHTML = "Searching...";
  fetchPlayer(fName, lName).then(players => {
    resultDiv.innerHTML = "";
    if (!players.length) {
      resultDiv.innerHTML = "<p>No players found.</p>";
      return;
    }
    players.forEach(player => {
      resultDiv.innerHTML += `
        <div style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem;">
          <p><strong>ID:</strong> ${player.playerId}</p>
          <p><strong>Name:</strong> ${player.fName} ${player.lName}</p>
          <p><strong>Role:</strong> ${player.role}</p>
          <p><strong>DOB:</strong> ${player.dob}</p>
          <p><strong>Team ID:</strong> ${player.team?.teamId ?? "N/A"}</p>
        </div>
      `;
    });
  });
}

function searchPerformance() {
  const fName = document.getElementById("perfFName").value.trim();
  const lName = document.getElementById("perfLName").value.trim();
  const resultDiv = document.getElementById("performanceResult");

  if (!fName || !lName) {
    resultDiv.innerHTML = `<p style="color:red;">Please enter both names.</p>`;
    return;
  }

  resultDiv.innerHTML = "Loading...";
  fetchPerformance(fName, lName)
    .then(perfs => {
      resultDiv.innerHTML = "";
      perfs.forEach(perf => {
        const overs = Math.floor(perf.deliveriesBowled / 6);
        const balls = perf.deliveriesBowled % 6;

        resultDiv.innerHTML += `
          <div style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem;">
            <p><strong>Player ID:</strong> ${perf.player?.playerId ?? "N/A"}</p>
            <p><strong>Runs Scored:</strong> ${perf.runsScored ?? 0}</p>
            <p><strong>Deliveries Faced:</strong> ${perf.deliveriesFaced ?? 0}</p>
            <p><strong>Fours:</strong> ${perf.fours ?? 0}</p>
            <p><strong>Sixes:</strong> ${perf.sixes ?? 0}</p>
            <p><strong>Batting Average:</strong> ${perf.battingAverage?.toFixed(2) ?? "N/A"}</p>
            <p><strong>Strike Rate:</strong> ${perf.battingStrikeRate?.toFixed(2) ?? "N/A"}</p>
            <hr>
            <p><strong>Deliveries Bowled:</strong> ${perf.deliveriesBowled ?? 0}</p>
            <p><strong>Overs Bowled:</strong> ${overs}.${balls}</p>
            <p><strong>Runs Given:</strong> ${perf.runsGiven ?? 0}</p>
            <p><strong>Wickets Taken:</strong> ${perf.wicketsTaken ?? 0}</p>
            <p><strong>Bowling Average:</strong> ${perf.bowlingAverage?.toFixed(2) ?? "N/A"}</p>
            <p><strong>Bowling Strike Rate:</strong> ${perf.bowlingStrikeRate?.toFixed(2) ?? "N/A"}</p>
            <hr>
            <p><strong>Innings Played:</strong> ${perf.inningsPlayed ?? 0}</p>
            <p><strong>Not Outs:</strong> ${perf.notOuts ?? 0}</p>
          </div>
        `;
      });
    })
    .catch(err => {
      resultDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
    });
}
