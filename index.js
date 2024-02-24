// Funcția pentru a obține meciurile pentru o ligă specificată
async function getMatchesForLeague(leagueCode) {
  try {
    const response = await fetch(`dataapiorg/${leagueCode}_matches.json`);
    if (!response.ok) {
      throw new Error(
        `Nu s-au putut obține meciurile pentru liga ${leagueCode}.`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `Eroare la obținerea meciurilor pentru liga ${leagueCode}:`,
      error
    );
    return [];
  }
}

// Funcția pentru a afișa meciurile pentru o ligă specificată pentru data curentă
async function toggleLeagueMatches(leagueCode) {
  const matchesTable = document.getElementById("matches-table");
  const matchesTableBody = document.getElementById("matches-table-body");

  if (matchesTable.style.display === "none") {
    try {
      const matches = await getMatchesForLeague(leagueCode);
      if (matches.length === 0) {
        console.log(`Nu sunt disponibile meciuri pentru liga ${leagueCode}.`);
        return;
      }
      // Filtrare pentru meciurile de astăzi
      const todayMatches = matches.filter((match) => isToday(match.utcDate));
      if (todayMatches.length === 0) {
        console.log(
          `Nu sunt disponibile meciuri pentru liga ${leagueCode} în data de astăzi.`
        );
        return;
      }
      // Afișează meciurile în tabel
      matchesTableBody.innerHTML = "";
      todayMatches.forEach((match) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${match.utcDate}</td>
                    <td>${match.homeTeam.name}</td>
                    <td>${match.awayTeam.name}</td>
                    <td>${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}</td>
                `;
        matchesTableBody.appendChild(row);
      });
      matchesTable.style.display = "block";
    } catch (error) {
      console.error(
        `Eroare la afișarea meciurilor pentru liga ${leagueCode}:`,
        error
      );
    }
  } else {
    // Ascunde tabelul dacă este deja afișat
    matchesTable.style.display = "none";
  }
}

// Adăugați evenimente de click pentru butoanele fiecărei ligi
const leagueButtons = document.querySelectorAll(".league-button");
leagueButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const leagueCode = button.getAttribute("data-league-code");
    await toggleLeagueMatches(leagueCode);
  });
});

// Funcție pentru a verifica dacă data este astăzi
function isToday(dateString) {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
