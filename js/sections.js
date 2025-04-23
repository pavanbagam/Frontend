const BASE_URL = "http://localhost:8080";

let allPlayers = [];
let uniqueFirstNames = [];
let uniqueLastNames = [];

function loadAllPlayers() {
  fetch(`${BASE_URL}/players`)
    .then(res => res.json())
    .then(players => {
      allPlayers = players;
      uniqueFirstNames = [...new Set(players.map(p => p.fName))];
      uniqueLastNames = [...new Set(players.map(p => p.lName))];
    });
}

function filterFirstNames() {
  const input = document.getElementById("fNameInput");
  const query = input.value.toLowerCase();
  const suggestionBox = document.getElementById("fNameSuggestions");

  suggestionBox.innerHTML = "";
  if (!query) return;

  const matches = uniqueFirstNames.filter(name => name.toLowerCase().startsWith(query));

  matches.forEach(name => {
    const div = document.createElement("div");
    div.textContent = name;
    div.onclick = () => {
      input.value = name;
      suggestionBox.innerHTML = "";
    };
    suggestionBox.appendChild(div);
  });
}

function filterLastNames() {
  const input = document.getElementById("lNameInput");
  const query = input.value.toLowerCase();
  const suggestionBox = document.getElementById("lNameSuggestions");

  suggestionBox.innerHTML = "";
  if (!query) return;

  const matches = uniqueLastNames.filter(name => name.toLowerCase().startsWith(query));

  matches.forEach(name => {
    const div = document.createElement("div");
    div.textContent = name;
    div.onclick = () => {
      input.value = name;
      suggestionBox.innerHTML = "";
    };
    suggestionBox.appendChild(div);
  });
}

function filterPerformanceFirstNames() {
  const input = document.getElementById("perfFName");
  const query = input.value.toLowerCase();
  const suggestionBox = document.getElementById("perfFNameSuggestions");

  suggestionBox.innerHTML = "";
  if (!query) return;

  const matches = uniqueFirstNames.filter(name => name.toLowerCase().startsWith(query));

  matches.forEach(name => {
    const div = document.createElement("div");
    div.textContent = name;
    div.onclick = () => {
      input.value = name;
      suggestionBox.innerHTML = "";
    };
    suggestionBox.appendChild(div);
  });
}

function filterPerformanceLastNames() {
  const input = document.getElementById("perfLName");
  const query = input.value.toLowerCase();
  const suggestionBox = document.getElementById("perfLNameSuggestions");

  suggestionBox.innerHTML = "";
  if (!query) return;

  const matches = uniqueLastNames.filter(name => name.toLowerCase().startsWith(query));

  matches.forEach(name => {
    const div = document.createElement("div");
    div.textContent = name;
    div.onclick = () => {
      input.value = name;
      suggestionBox.innerHTML = "";
    };
    suggestionBox.appendChild(div);
  });
}



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
        <div style="display: flex; gap: 1rem; align-items: flex-start; flex-wrap: wrap;">
          <div style="position: relative;">
            <input type="text" id="fNameInput" placeholder="First Name" oninput="filterFirstNames()" autocomplete="off" />
            <div id="fNameSuggestions" class="autocomplete-suggestions"></div>
          </div>
          <div style="position: relative;">
            <input type="text" id="lNameInput" placeholder="Last Name" oninput="filterLastNames()" autocomplete="off" />
            <div id="lNameSuggestions" class="autocomplete-suggestions"></div>
          </div>
          <div>
            <button onclick="searchPlayer()">Search</button>
          </div>
        </div>
        <div id="profileResult" style="margin-top: 1rem;"></div>
      `;
      loadAllPlayers();
      break;

      

      case 'performance':
        container.innerHTML = `
          <h2>Search Player Performance</h2>
          <div style="display: flex; gap: 1rem; align-items: flex-start; flex-wrap: wrap;">
            <div style="position: relative;">
              <input type="text" id="perfFName" placeholder="First Name" oninput="filterPerformanceFirstNames()" autocomplete="off" />
              <div id="perfFNameSuggestions" class="autocomplete-suggestions"></div>
            </div>
            <div style="position: relative;">
              <input type="text" id="perfLName" placeholder="Last Name" oninput="filterPerformanceLastNames()" autocomplete="off" />
              <div id="perfLNameSuggestions" class="autocomplete-suggestions"></div>
            </div>
            <div>
              <button onclick="searchPerformance()">Search</button>
            </div>
          </div>
          <div id="performanceResult" style="margin-top: 1rem;"></div>
        `;
        loadAllPlayers();
        break;
      

        case 'scorer':
          container.innerHTML = `
            <h2>Scorer Section</h2>

            <!-- TEAM CREATION -->
            <h3>Create Team</h3>
            <form id="teamForm">
              <input type="text" id="teamName" placeholder="Team Name *" required />
              <input type="text" id="teamCountry" placeholder="Country" />
              <input type="text" id="teamCoach" placeholder="Coach" />
              <input type="text" id="teamCaptain" placeholder="Captain" />
              <button type="submit">Create Team</button>
            </form>
            <div id="teamMessage" style="margin-top:1rem;"></div>
            <ul id="teamList"></ul>

            <hr />

            <!-- PLAYER CREATION -->
            <h3>Create Player</h3>
            <form id="playerForm">
              <input type="text" id="fName" placeholder="First Name *" required />
              <input type="text" id="lName" placeholder="Last Name *" required />
              <input type="text" id="role" placeholder="Role (e.g., Batsman)" required />
              <input type="date" id="dob" placeholder="Date of Birth *" required />
              <button type="submit">Create Player</button>
            </form>
            <div id="playerMessage" style="margin-top:1rem;"></div>


            <hr />

            <!-- SQUAD CREATION -->
            <h3>Create Squad</h3>
            <form id="squadForm">
              <label>Select Team:</label><br />
              <select id="teamSelect" required></select><br /><br />

              <label>Select Tournament ID (optional):</label><br />
              <input type="number" id="tournamentId" /><br /><br />

              <label>Select Players:</label><br />
              <select id="playerSelect" multiple size="8" required></select><br /><br />

              <button type="submit">Add to Squad</button>
            </form>
            <div id="squadMessage" style="margin-top:1rem;"></div>

            <hr />

            <!-- DELIVERY CREATION -->
            <h3>Add Delivery</h3>
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

          // === TEAM CREATION ===
          document.getElementById("teamForm").onsubmit = function (e) {
            e.preventDefault();
            const newTeam = {
              name: document.getElementById("teamName").value.trim(),
              country: document.getElementById("teamCountry").value.trim(),
              coach: document.getElementById("teamCoach").value.trim(),
              captain: document.getElementById("teamCaptain").value.trim()
            };

            fetch(`${BASE_URL}/teams`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newTeam)
            })
              .then(res => {
                if (!res.ok) throw new Error("Failed to create team (check if name already exists)");
                return res.json();
              })
              .then(data => {
                document.getElementById("teamMessage").innerHTML = `<p style="color:green;">Team created: ${data.name}</p>`;
                showSection("scorer");
              })
              .catch(err => {
                document.getElementById("teamMessage").innerHTML = `<p style="color:red;">${err.message}</p>`;
              });
          };

          // Load team list
          fetch(`${BASE_URL}/teams`)
            .then(res => res.json())
            .then(teams => {
              const list = document.getElementById("teamList");
              teams.forEach(team => {
                const li = document.createElement("li");
                li.textContent = `${team.name} (${team.country || "N/A"}) - Coach: ${team.coach || "N/A"}, Captain: ${team.captain || "N/A"}`;
                list.appendChild(li);

                const squadTeamOption = document.createElement("option");
                squadTeamOption.value = team.teamId;
                squadTeamOption.textContent = `${team.name} (${team.country})`;
                document.getElementById("teamSelect").appendChild(squadTeamOption);
              });
            });
          // === PLAYER CREATION ===
            document.getElementById("playerForm").onsubmit = function (e) {
              e.preventDefault();
            
              const fName = document.getElementById("fName").value.trim();
              const lName = document.getElementById("lName").value.trim();
              const role = document.getElementById("role").value.trim();
              const dob = document.getElementById("dob").value;
            
              if (!fName || !lName || !role || !dob) {
                document.getElementById("playerMessage").innerHTML = `<p style="color:red;">All fields are required.</p>`;
                return;
              }
            
              const newPlayer = {
                fName,
                lName,
                role,
                dob // ISO date format from <input type="date" /> works fine
              };
            
              fetch(`${BASE_URL}/players`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPlayer)
              })
                .then(res => {
                  if (!res.ok) throw new Error("Failed to create player");
                  return res.json();
                })
                .then(data => {
                  document.getElementById("playerMessage").innerHTML = `<p style="color:green;">Player created: ${data.fName} ${data.lName}</p>`;
                  showSection("scorer"); // refresh form + squad dropdown
                })
                .catch(err => {
                  document.getElementById("playerMessage").innerHTML = `<p style="color:red;">${err.message}</p>`;
                });
            };
            
          // === SQUAD CREATION ===
          fetch(`${BASE_URL}/players`)
            .then(res => res.json())
            .then(players => {
              const playerSelect = document.getElementById("playerSelect");
              players.forEach(player => {
                const option = document.createElement("option");
                option.value = player.playerId;
                option.textContent = `${player.fName} ${player.lName}`;
                playerSelect.appendChild(option);
              });
            });

          document.getElementById("squadForm").onsubmit = function (e) {
            e.preventDefault();
            const teamId = parseInt(document.getElementById("teamSelect").value);
            const tournamentId = document.getElementById("tournamentId").value.trim();
            const selectedPlayerIds = [...document.getElementById("playerSelect").selectedOptions]
              .map(opt => parseInt(opt.value));

            if (!selectedPlayerIds.length) {
              document.getElementById("squadMessage").innerHTML = `<p style="color:red;">Please select at least one player.</p>`;
              return;
            }

            const requests = selectedPlayerIds.map(playerId => {
              const squadObj = {
                team: { teamId },
                player: { playerId },
                tournamentId: tournamentId ? parseInt(tournamentId) : null
              };

              return fetch(`${BASE_URL}/squads`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(squadObj)
              });
            });

            Promise.all(requests)
              .then(responses => {
                if (responses.some(res => !res.ok)) throw new Error("Some squad entries failed");
                return Promise.all(responses.map(res => res.json()));
              })
              .then(data => {
                document.getElementById("squadMessage").innerHTML = `<p style="color:green;">Squad created with ${data.length} players.</p>`;
              })
              .catch(err => {
                document.getElementById("squadMessage").innerHTML = `<p style="color:red;">${err.message}</p>`;
              });
          };

          // === DELIVERY CREATION ===
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
