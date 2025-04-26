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
  localStorage.setItem('currentSection', section);  // <-- Save section name
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

            <!-- MATCH CREATION -->
            <h3>Create Match</h3>
            <form id="gameForm">

              <label>Match Code <small style="color:#888">(e.g. 20250423IndiaVSAustralia1)</small>:</label><br />
              <input type="text" id="matchCode" placeholder="YYYYMMDDTeam1VSTeam2X" required /><br /><br />
              <label>Match Date:</label><br />
              <input type="date" id="gameDate" required /><br /><br />

              <label>Venue:</label><br />
              <input type="text" id="venue" required /><br /><br />

              <label>Match Type:</label><br />
              <input type="text" id="type" placeholder="ODI, T20, Test" required /><br /><br />

              <label>Umpire:</label><br />
              <input type="text" id="umpire" required /><br /><br />

              <label>Team 1:</label><br />
              <select id="team1" required></select><br /><br />

              <label>Team 2:</label><br />
              <select id="team2" required></select><br /><br />

              <label>Toss Winner:</label><br />
              <select id="tossWinner" required></select><br /><br />

              <label>Tournament ID (optional):</label><br />
              <input type="number" id="tournamentId" /><br /><br />

              <button type="submit">Create Match</button>
            </form>
            <div id="gameMessage" style="margin-top:1rem;"></div>

            
            <hr />

            <!-- INNING CREATION -->
            <h3>Create Inning</h3>
            <form id="inningForm">
              <!-- ❶ Match selector (shows matchCode) -->
              <label>Select Match (matchCode):</label><br />
              <select id="matchSelect" required></select><br /><br />

              <!-- ❷ Team selector – will be repopulated whenever match changes -->
              <label>Batting Team:</label><br />
              <select id="inningTeamSelect" required></select><br /><br />

              <!-- ❸ Hidden / auto‑filled fields -->
              <input type="hidden" id="initRuns"  value="0" />
              <input type="hidden" id="initDeliv" value="0" />
              <input type="hidden" id="initWkts"  value="0" />

              <button type="submit">Create Inning</button>
            </form>
            <div id="inningMsg" style="margin-top:1rem;"></div>

            <hr />


            <!-- DELIVERY CREATION  (new, match‑aware) -->
            <h3>Add Delivery</h3>
            <form id="deliveryForm">
              <!-- a)  Match & inning -->
              <label>Match (matchCode)</label><br/>
              <select id="dMatchSel" required></select><br/><br/>

              <label>Batting Inning (team)</label><br/>
              <select id="dInningSel" required></select><br/><br/>

              <!-- b)  4 player drop‑downs -->
              <label>Striker</label><br/>
              <select id="strikerSel" required></select><br/><br/>

              <label>Non‑Striker</label><br/>
              <select id="nonStrikerSel" required></select><br/><br/>

              <label>Bowler</label><br/>
              <select id="bowlerSel" required></select><br/><br/>

              <label>Fielder (optional)</label><br/>
              <select id="fielderSel"><option value="">– None –</option></select><br/><br/>

              <!-- c)  delivery details -->
              <input type="number" id="runsScored" placeholder="Runs Scored" value="0" required /><br/>
              <label><input type="checkbox" id="isWicket" /> Wicket</label><br/>
              <input type="text" id="dismissalType" placeholder="Dismissal Type (if out)" /><br/>
              <input type="number" id="ballNumber" placeholder="Ball #" required /><br/>
              <input type="number" id="overNumber" placeholder="Over #" required /><br/>
              <label><input type="checkbox" id="wideOrNoBall" /> Wide / No‑Ball</label><br/><br/>

              <button type="submit">Add Delivery</button>
            </form>
            <div id="deliveryMsg" style="margin-top:1rem;"></div>

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

          // === MATCH CREATION ===
          fetch(`${BASE_URL}/teams`)
          .then(res => res.json())
          .then(teams => {
            const team1Sel = document.getElementById("team1");
            const team2Sel = document.getElementById("team2");
            const tossSel = document.getElementById("tossWinner");

            teams.forEach(team => {
              const opt1 = new Option(team.name, team.teamId);
              const opt2 = new Option(team.name, team.teamId);
              const optToss = new Option(team.name, team.teamId);

              team1Sel.appendChild(opt1);
              team2Sel.appendChild(opt2);
              tossSel.appendChild(optToss);
            });
          });

          document.getElementById("gameForm").onsubmit = function (e) {
            e.preventDefault();
          
            const game = {
              matchCode : document.getElementById("matchCode").value.trim(),
              date: document.getElementById("gameDate").value,
              venue: document.getElementById("venue").value,
              type: document.getElementById("type").value,
              umpire: document.getElementById("umpire").value,
              tossWinner   : { teamId: parseInt(document.getElementById("tossWinner").value) },
              tournament: document.getElementById("tournamentId").value
                ? { tournamentId: parseInt(document.getElementById("tournamentId").value) }
                : null,
              team1: { teamId: parseInt(document.getElementById("team1").value) },
              team2: { teamId: parseInt(document.getElementById("team2").value) }
            };

            const pattern = /^\d{8}.+VS.+\w+$/i;     // simple check
            if (!pattern.test(game.matchCode)) {
              document.getElementById("gameMessage").innerHTML =
                  `<p style="color:red;">Match Code must follow YYYYMMDD&ltem1&gtVS&ltem2&gt&ltNbr&gt</p>`;
              return;
            }
          
            fetch(`${BASE_URL}/games`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(game)
            })
              .then(res => {
                if (!res.ok) throw new Error("Failed to create game");
                return res.json();
              })
              .then(data => {
                document.getElementById("gameMessage").innerHTML = `<p style="color:green;">Match created (ID: ${data.gameId})</p>`;
                showSection("scorer");
              })
              .catch(err => {
                document.getElementById("gameMessage").innerHTML = `<p style="color:red;">${err.message}</p>`;
              });
          };
          
          // === INNING CREATION ===
          /* ------------  INNING  JS  ------------- */
          // 1.  Populate the match dropdown with matchCode
          fetch(`${BASE_URL}/games`)
          .then(r => r.json())
          .then(games => {
            const matchSel = document.getElementById("matchSelect");
            games.forEach(g => {
              const opt = new Option(g.matchCode, g.gameId);   // value = gameId
              matchSel.appendChild(opt);
            });
            // trigger first‑time load of team list
            if (games.length) matchSel.dispatchEvent(new Event("change"));
          });

          // 2.  When a match is picked, load its two teams into the team dropdown
          document.getElementById("matchSelect").onchange = function () {
          const gameId = parseInt(this.value);
          if (!gameId) return;

          // fetch the single game to know its teams
          fetch(`${BASE_URL}/games/${gameId}`)
            .then(r => r.json())
            .then(game => {
              const teamSel   = document.getElementById("inningTeamSelect");
              teamSel.innerHTML = "";                         // clear old entries

              // helper to add <option> and then fetch squad size for that team
              const addTeamOption = (teamObj) => {
                const opt = new Option(teamObj.name || `Team ${teamObj.teamId}`,
                                      teamObj.teamId);
                teamSel.appendChild(opt);
              };

              addTeamOption(game.team1);
              addTeamOption(game.team2);

              // fire change so squad‑size logic below runs for first team
              teamSel.dispatchEvent(new Event("change"));
            });
          };

          // 3.  When batting‑team changes, look up squad size → wickets
          document.getElementById("inningTeamSelect").onchange = function () {
          const teamId = parseInt(this.value);
          if (!teamId) return;

          fetch(`${BASE_URL}/squads/count?teamId=` + teamId)
            .then(r => r.json())
            .then(count => {
              document.getElementById("initWkts").value = count;
            })
            .catch(() => { document.getElementById("initWkts").value = 0; });
          };

          // 4.  Save inning
          document.getElementById("inningForm").onsubmit = function (e) {
          e.preventDefault();

          const body = {
            game: { gameId: parseInt(document.getElementById("matchSelect").value) },
            team: { teamId: parseInt(document.getElementById("inningTeamSelect").value) },
            totalRuns:    parseInt(document.getElementById("initRuns").value),
            deliveries:   parseInt(document.getElementById("initDeliv").value),
            wickets:      parseInt(document.getElementById("initWkts").value),
            overs:        0                                   // start at 0 overs
          };

          fetch(`${BASE_URL}/innings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          })
            .then(r => {
              if (!r.ok) throw new Error("Failed to create inning");
              return r.json();
            })
            .then(data => {
              document.getElementById("inningMsg").innerHTML =
                `<p style="color:green;">Inning created (ID ${data.inningId})</p>`;
            })
            .catch(err => {
              document.getElementById("inningMsg").innerHTML =
                `<p style="color:red;">${err.message}</p>`;
            });
          };


          /* --------- DELIVERY  JS ---------- */

          // Helper – populate <select> with options from array of {id,name}
          function fillSelect(sel, arr, idKey, labelKey, emptyLabel) {
            sel.innerHTML = "";
            if (emptyLabel) sel.appendChild(new Option(emptyLabel, ""));
            arr.forEach(o => sel.appendChild(new Option(o[labelKey], o[idKey])));
          }

          /* ❶ MATCH list */
          fetch(`${BASE_URL}/games`)
            .then(r => r.json())
            .then(games => {
              const ms = document.getElementById("dMatchSel");
              games.forEach(g => ms.appendChild(new Option(g.matchCode, g.gameId)));
              if (games.length) ms.dispatchEvent(new Event("change"));
            });

          /* ❷ When match changes → load innings for that game */
          document.getElementById("dMatchSel").onchange = function () {
            const gameId = parseInt(this.value);
            if (!gameId) return;

            fetch(`${BASE_URL}/innings/byGame/${gameId}/mini`)   // returns [{inningId,…}]         // you'd expose this
              .then(r => r.json())
              .then(inns => {
                const isel = document.getElementById("dInningSel");
                fillSelect(isel,
                  inns.map(i => ({
                     id   : i.inningId,
                     label: `${i.teamName} (ID ${i.teamId})`
                  })),
                  "id","label");
                if (inns.length) isel.dispatchEvent(new Event("change"));
              });
          };

          /* ❸ When inning changes → load squads to populate player dropdowns */
          document.getElementById("dInningSel").onchange = function () {
            const inningId = parseInt(this.value);
            if (!inningId) return;

            // a) get inning to know batting team and match (for bowling team)
            fetch(`${BASE_URL}/innings/${inningId}`)
              .then(r => r.json())
              .then(inning => {
                const battingId  = inning.team.teamId;
                const matchId    = parseInt(document.getElementById("dMatchSel").value);

                // b) fetch match -> know the bowling team
                return fetch(`${BASE_URL}/games/${matchId}`)
                  .then(r => r.json())
                  .then(game => {
                    const bowlingId = (game.team1.teamId === battingId)
                                      ? game.team2.teamId : game.team1.teamId;
                    return { battingId, bowlingId };
                  });
              })
              .then(ids => {
                // c) now fetch squads for both teams and populate selects
                Promise.all([
                  fetch(`${BASE_URL}/squads/mini/byTeam/${ids.battingId}`).then(r => r.json()),
                  fetch(`${BASE_URL}/squads/mini/byTeam/${ids.bowlingId}`).then(r => r.json())
                ]).then(([batSquad, bowlSquad]) => {
                  const strikerSel  = document.getElementById("strikerSel");
                  const nonStrkSel  = document.getElementById("nonStrikerSel");
                  const bowlerSel   = document.getElementById("bowlerSel");
                  const fielderSel  = document.getElementById("fielderSel");

                  fillSelect(strikerSel,  batSquad, "playerId", "playerName");
                  fillSelect(nonStrkSel,  batSquad, "playerId", "playerName");
                  fillSelect(bowlerSel,   bowlSquad, "playerId", "playerName");
                  fillSelect(fielderSel,  bowlSquad, "playerId", "playerName", "– None –");
                });
              });
          };

          /* ❹ Submit delivery */
          document.getElementById("deliveryForm").onsubmit = function (e) {
            e.preventDefault();

            const body = {
              inning:     { inningId: parseInt(document.getElementById("dInningSel").value) },
              batsman:    { playerId: parseInt(document.getElementById("strikerSel").value) },
              nonStriker: { playerId: parseInt(document.getElementById("nonStrikerSel").value) },
              bowler:     { playerId: parseInt(document.getElementById("bowlerSel").value) },
              fielder:    document.getElementById("fielderSel").value
                            ? { playerId: parseInt(document.getElementById("fielderSel").value) }
                            : null,

              runsScored:  parseInt(document.getElementById("runsScored").value),
              isWicket:    document.getElementById("isWicket").checked,
              dismissalType: document.getElementById("dismissalType").value || null,
              ballNumber:  parseInt(document.getElementById("ballNumber").value),
              overNumber:  parseInt(document.getElementById("overNumber").value),
              wideOrNoBall:document.getElementById("wideOrNoBall").checked
            };

            fetch(`${BASE_URL}/deliveries`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            })
              .then(r => {
                if (!r.ok) throw new Error("Failed to add delivery");
                return r.json();
              })
              .then(d => {
                document.getElementById("deliveryMsg").innerHTML =
                  `<p style="color:green;">Delivery ID ${d.deliveryId} saved.</p>`;
              })
              .catch(err => {
                document.getElementById("deliveryMsg").innerHTML =
                  `<p style="color:red;">${err.message}</p>`;
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
        <h4>${game.matchCode || "Match " + game.gameId}</h4>
        <p><strong>${game.team1?.name ?? "Team 1"} vs ${game.team2?.name ?? "Team 2"}</strong></p>
        <p><strong>Date:</strong> ${game.date ? new Date(game.date).toLocaleString() : "N/A"}</p>
        <p><strong>Venue:</strong> ${game.venue || "N/A"}</p>
        <p><strong>Type:</strong> ${game.type || "N/A"}</p>
        <p><strong>Umpire:</strong> ${game.umpire || "N/A"}</p>
        ${game.tossWinner ? `<p><strong>Toss:</strong> ${game.tossWinner.name}</p>` : ""}
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

window.onload = function() {
  const savedSection = localStorage.getItem('currentSection') || 'home'; // default to home
  showSection(savedSection);
};
