// Funcția pentru a verifica dacă o dată este azi
function isToday(dateString) {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Funcția pentru a afișa mesajul de pop-up când nu sunt disponibile meciuri
function showNoMatchesAvailableMessage(leagueName) {
  alert(
    `Nu sunt disponibile meciuri pentru liga ${leagueName} în data de azi.`
  );
}

// Funcția pentru a obține meciurile pentru o ligă specificată
async function getMatchesForLeague(leagueCode) {
  try {
    const response = await fetch(
      `dataapiorg/${leagueCode.toUpperCase()}_matches.json`
    );
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
        showNoMatchesAvailableMessage(leagueCode);
        return;
      }
      // Filtrare pentru meciurile de astăzi
      const todayMatches = matches.filter((match) => isToday(match.utcDate));
      if (todayMatches.length === 0) {
        showNoMatchesAvailableMessage(leagueCode);
        return;
      }
      // Afișează meciurile în tabel
      matchesTableBody.innerHTML = "";
      todayMatches.forEach((match) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${formatDate(match.utcDate)}</td>
                <td>${match.homeTeam.name}</td>
                <td>${match.awayTeam.name}</td>
                <td>${match.score.fullTime.homeTeam} - ${
          match.score.fullTime.awayTeam
        }</td>
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

// Funcție pentru a formata data și ora în formatul dorit
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return date.toLocaleString("en-GB", options).replace(",", " -");
}

// Adăugați evenimente de click pentru butoanele fiecărei ligi
const leagueButtons = document.querySelectorAll(".league-button");
leagueButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const leagueCode = button.getAttribute("data-league-code");
    await toggleLeagueMatches(leagueCode);
  });
});
