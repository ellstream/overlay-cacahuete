const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";

async function loadData() {
    try {
        const response = await fetch(SHEET_URL + "&t=" + Date.now());
        const csv = await response.text();
        const rows = csv.split("\n");

        let jetons = 0;

        rows.forEach(row => {
            // Utilisation d'une regex pour gérer les éventuelles guillemets du CSV
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            
            if (cols.length >= 2) {
                const key = cols[0].replace(/"/g, "").trim().toLowerCase();
                const val = cols[1].replace(/"/g, "").trim();
                
                console.log("Lecture ligne :", key, "=", val); // DEBUG : Vérifiez la console F12

                if (key === "jetons_casino") {
                    jetons = parseInt(val) || 0;
                }
            }
        });

        // Mise à jour UI
        const countEl = document.getElementById("jetonsCount");
        const barEl = document.getElementById("barFill");
        const box = document.getElementById("casinoBox");
        const status = document.getElementById("status");

        if (countEl) countEl.textContent = jetons;
        if (barEl) barEl.style.width = `${Math.min((jetons / 5) * 100, 100)}%`;

        if (box && status) {
            if (jetons >= 3) {
                box.classList.add("red-mode");
                status.textContent = "🚪 SALLE INTERDITE DÉBLOQUÉE";
            } else {
                box.classList.remove("red-mode");
                status.textContent = "🎰 Collecte en cours...";
            }
        }

    } catch (err) {
        console.error("Erreur de connexion :", err);
    }
}
