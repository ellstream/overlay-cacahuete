const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";

async function loadData() {
    try {
        const response = await fetch(SHEET_URL + "&t=" + Date.now());
        const csv = await response.text();
        const rows = csv.trim().split("\n");

        let jetons = 0;

        rows.forEach(row => {
            const parts = row.split(",");
            if (parts.length >= 2) {
                const key = parts[0].replace(/"/g, "").trim();
                const value = parseInt(parts[1].replace(/"/g, "").trim()) || 0;
                if (key === "Jetons_Casino") {
                    jetons = value;
                }
            }
        });

        jetons = Math.min(jetons, 5);

        // Mise à jour du compteur
        document.getElementById("counter").innerHTML = `🪙 ${jetons} / 5`;

        // Mise à jour de la barre
        document.getElementById("barFill").style.width = `${(jetons / 5) * 100}%`;

        const box = document.getElementById("casinoBox");
        const status = document.getElementById("status");

        if (jetons >= 5) {
            status.innerHTML = "👑 SALLE SECRÈTE + JACKPOT";
            box.classList.add("red-mode");
        } 
        else if (jetons >= 3) {
            status.innerHTML = "🚪 SALLE INTERDITE DÉBLOQUÉE";
            box.classList.add("red-mode");
        } 
        else {
            status.innerHTML = "🎰 Collecte des jetons...";
            box.classList.remove("red-mode");
        }

    } catch (err) {
        console.error(err);
    }
}

// Chargement initial + rafraîchissement
loadData();
setInterval(loadData, 3000);
