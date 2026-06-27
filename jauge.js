const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";

async function loadData() {
    try {
        const response = await fetch(SHEET_URL + "?t=" + Date.now());
        const csv = await response.text();
        const rows = csv.trim().split("\n");

        let jetons = 0;

        rows.forEach(row => {
            const cols = row.split(",");
            if (cols.length >= 2) {
                const key = cols[0].replace(/"/g, "").trim();
                if (key === "Jetons_Casino") {
                    jetons = parseInt(cols[1].replace(/"/g, "").trim()) || 0;
                }
            }
        });

        jetons = Math.min(jetons, 5);

        document.getElementById("jetonsCount").textContent = jetons;
        document.getElementById("barFill").style.width = (jetons / 5 * 100) + "%";

        const box = document.getElementById("casinoBox");
        const status = document.getElementById("status");

        if (jetons >= 3) {
            box.classList.add("red-mode");
            status.textContent = "🚪 SALLE INTERDITE DÉBLOQUÉE";
        } else {
            box.classList.remove("red-mode");
            status.textContent = "🎰 Collecte en cours...";
        }

    } catch (e) {
        console.error("Erreur :", e);
    }
}

// Premier chargement + rafraîchissement
loadData();
setInterval(loadData, 2500);
