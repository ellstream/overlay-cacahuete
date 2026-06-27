const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";

async function loadData() {
    let jetons = 0;

    try {
        const response = await fetch(SHEET_URL + "?t=" + Date.now());
        const csv = await response.text();
        const rows = csv.trim().split("\n");

        rows.forEach(row => {
            const cols = row.split(",");
            if (cols.length < 2) return;

            const key = cols[0].replace(/"/g, "").trim().toLowerCase();
            
            // On accepte plusieurs variantes possibles
            if (key.includes("jeton") || key.includes("casino")) {
                jetons = parseInt(cols[1].replace(/"/g, "").trim()) || 0;
                console.log(`✅ Trouvé : "${cols[0]}" = ${jetons}`);
            }
        });

    } catch (err) {
        console.error("Erreur Sheet :", err);
    }

    jetons = Math.min(Math.max(0, jetons), 5);

    // Mise à jour
    document.getElementById("jetonsCount").textContent = jetons;
    document.getElementById("barFill").style.width = `${(jetons / 5) * 100}%`;

    const box = document.getElementById("casinoBox");
    const status = document.getElementById("status");

    if (jetons >= 3) {
        box.classList.add("red-mode");
        status.textContent = "🚪 SALLE INTERDITE DÉBLOQUÉE";
    } else {
        box.classList.remove("red-mode");
        status.textContent = "🎰 Collecte en cours...";
    }
}

loadData();
setInterval(loadData, 3000);
