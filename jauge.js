document.addEventListener("DOMContentLoaded", () => {
    const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";

    async function loadData() {
        let jetons = 0;

        try {
            const response = await fetch(SHEET_URL + "?t=" + Date.now());
            if (!response.ok) throw new Error("Fetch failed");

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
            console.error("Erreur Sheet (normal si bloqué) :", e);
        }

        jetons = Math.min(Math.max(0, jetons), 5);

        // Mise à jour des éléments
        const countEl = document.getElementById("jetonsCount");
        if (countEl) countEl.textContent = jetons;

        const bar = document.getElementById("barFill");
        if (bar) bar.style.width = `${(jetons / 5) * 100}%`;

        const box = document.getElementById("casinoBox");
        const status = document.getElementById("status");

        if (box) {
            if (jetons >= 3) {
                box.classList.add("red-mode");
                if (status) status.textContent = "🚪 SALLE INTERDITE DÉBLOQUÉE";
            } else {
                box.classList.remove("red-mode");
                if (status) status.textContent = "🎰 Collecte en cours...";
            }
        }
    }

    loadData();
    setInterval(loadData, 3000);
});
