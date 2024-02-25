const axios = require("axios");
const fs = require("fs");
const path = require("path");

const dataDir = "dataapiorg";

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Funcție pentru a obține meciurile pentru o anumită ligă
async function getMatchesForLeague(leagueCode) {
  try {
    const apiKey = "fe1a773fd9304fc091239f3d1d753d71";
    const response = await axios.get(
      `https://api.football-data.org/v2/competitions/${leagueCode}/matches`,
      {
        headers: {
          "X-Auth-Token": apiKey,
        },
      }
    );
    return response.data.matches;
  } catch (error) {
    console.error(
      `Eroare la obținerea meciurilor pentru liga ${leagueCode}:`,
      error
    );
    return [];
  }
}

// Funcție pentru a importa și a salva meciurile pentru o anumită ligă
async function importMatchesForLeague(leagueCode) {
  const matches = await getMatchesForLeague(leagueCode);
  if (matches.length > 0) {
    fs.writeFile(
      path.join(dataDir, `${leagueCode}_matches.json`),
      JSON.stringify(matches, null, 2),
      (err) => {
        if (err) {
          console.error(
            `Eroare la salvarea meciurilor pentru liga ${leagueCode}:`,
            err
          );
        } else {
          console.log(
            `Meciurile pentru liga ${leagueCode} au fost salvate cu succes!`
          );
        }
      }
    );
  } else {
    console.log(`Nu au fost găsite meciuri pentru liga ${leagueCode}.`);
  }
}

leagues.forEach((league) => {
  const button = document.createElement("button");
  button.textContent = league.name;
  button.setAttribute("class", "league-button");
  button.setAttribute("data-league-code", league.code);
  leagueButtonsContainer.appendChild(button);
});

// Lista cu codurile ligilor pentru care vrei să obții meciuri
const leagues = [
  "BL1",
  "DED",
  "BSA",
  "PD",
  "FL1",
  "ELC",
  "PPL",
  "EC",
  "SA",
  "PL",
  "CLI",
];

// Iterează prin fiecare ligă și apelează funcția pentru a importa meciurile
leagues.forEach(async (leagueCode) => {
  await importMatchesForLeague(leagueCode);
});
