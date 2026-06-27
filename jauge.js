const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";

async function loadData() {
    let jetons = 0;

    try {
        const response = await fetch(SHEET_URL + "?t=" + Date.now());
        const csv = await response.text();
        const rows = csv.trim().split("\n");

        rows.forEach(row => {
            const cols = row.split(",");
            if (cols.length >= 2) {
                const key = cols[0].replace(/"/g, "").trim();
                if (key === "Jetons_Casino") {
                    jetons = parseInt(cols[1].replace(/"/g, "").trim()) || 0;
                }
            }
        });
    } catch (e) {
        console.error("Erreur Sheet :", e);
        // Pour tester : commente la ligne du dessus et décommente celle-ci
        // jetons = 3; // ← pour tester le mode rouge
    }

    jetons = Math.min(jetons, 5);

    // Mise à jour
    const countEl = document.getElementById("jetonsCount");
    if (countEl) countEl.textContent = jetons;

    const bar = document.getElementById("barFill");
    if (bar) bar.style.width = `${(jetons / 5) * 100}%`;

    const box = document.getElementById("casinoBox");
    const status = document.getElementById("status");

    if (jetons >= 3) {
        box.classList.add("red-mode");
        if (status) status.textContent = "🚪 SALLE INTERDITE DÉBLOQUÉE";
    } else {
        box.classList.remove("red-mode");
        if (status) status.textContent = "🎰 Collecte en cours...";
    }
}

loadData();
setInterval(loadData, 3000);
