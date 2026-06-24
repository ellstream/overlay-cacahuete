const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";

async function loadData() {
    try {
        const response = await fetch(SHEET_URL + "&t=" + Date.now());
        const csv = await response.text();
        const rows = csv.trim().split("\n");

        let totalJetons = 0;

        rows.forEach(row => {
            const parts = row.split(",");
            if (parts.length >= 2) {
                const key = parts[0].replace(/"/g, "").trim();
                const value = parseInt(parts[1].replace(/"/g, "").trim()) || 0;
                
                // On vérifie si la clé contient "Jetons_Casino"
                if (key.includes("Jetons_Casino")) {
                    totalJetons += value;
                }
            }
        });

        // Mise à jour de l'interface
        const jetons = Math.min(5, totalJetons);
        document.getElementById("counter").innerHTML = `🪙 ${jetons} / 5`;
        document.getElementById("barFill").style.width = (jetons / 5) * 100 + "%";

        const status = document.getElementById("status");
        if (jetons >= 5) status.innerHTML = "👑 SALLE SECRÈTE DÉBLOQUÉE";
        else if (jetons >= 3) status.innerHTML = "🚪 SALLE INTERDITE DÉBLOQUÉE";
        else status.innerHTML = "Collecte en cours...";

    } catch(err) {
        console.error("Erreur de chargement :", err);
    }
}

const jetons =
parseInt(
data["Jetons_Casino"] || 0
);

const percent =
Math.min(
100,
(jetons/5)*100
);

document.getElementById(
"counter"
).innerHTML =
`🪙 ${jetons} / 5`;

document.getElementById(
"barFill"
).style.width =
percent + "%";

const status =
document.getElementById(
"status"
);

if(jetons >= 5){

status.innerHTML =
"👑 SALLE SECRÈTE DÉBLOQUÉE";

}
else if(jetons >= 3){

status.innerHTML =
"🚪 SALLE INTERDITE DÉBLOQUÉE";

}
else{

status.innerHTML =
"Collecte en cours...";

}

}catch(err){

console.error(err);

}

}

loadData();

setInterval(
loadData,
3000
);
