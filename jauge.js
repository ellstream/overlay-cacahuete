// Utilisation de ton lien Google Sheets unique
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

async function loadData() {
    try {
        // Fetch avec timestamp anti-cache pour une réactivité maximale
        const response = await fetch(SHEET_URL + "&t=" + Date.now());
        const csv = await response.text();
        const rows = csv.trim().split("\n");
        
        let currentSubs = 0;
        let targetSubs = 5; // Ton palier max pour le Jackpot

        rows.forEach(row => {
            const firstComma = row.indexOf(",");
            if (firstComma !== -1) {
                const key = row.substring(0, firstComma).replace(/"/g, "").trim().toLowerCase();
                const value = row.substring(firstComma + 1).replace(/"/g, "").trim();

                // On récupère tes données de subs du tableur
                if (key === "subs_actuels") {
                    currentSubs = parseInt(value) || 0;
                }
                if (key === "objectif") {
                    targetSubs = parseInt(value) || 5;
                }
            }
        });

        // Sécurité pour ne pas dépasser 100% visuellement
        if (currentSubs > targetSubs) currentSubs = targetSubs;

        // Calcul du pourcentage de remplissage
        const percent = Math.round((currentSubs / targetSubs) * 100);

        // Mise à jour de la barre et du texte sur l'écran
        document.getElementById("progressBarFill").style.width = percent + "%";
        document.getElementById("progressText").textContent = `${currentSubs} / ${targetSubs} SUBS`;

        // ÉVOLUTION DU NIVEAU SELON TES PALIERS (0->5)
        const levelElement = document.getElementById("casinoLevel");
        
        if (currentSubs >= 5) {
            levelElement.textContent = "🚨 JACKPOT PRÊT !";
            levelElement.style.color = "#ff3333"; // Rouge alerte pour le niveau Max
        } else if (currentSubs >= 4) {
            levelElement.textContent = "⚡ NIVEAU : 4 (LA FIÈVRE)";
            levelElement.style.color = "#ff5500"; // Orange Flash pour le nouveau Palier 4
        } else if (currentSubs >= 3) {
            levelElement.textContent = "⭐ NIVEAU : 3 (INTERDIT)";
            levelElement.style.color = "#ffaa00"; 
        } else if (currentSubs >= 2) {
            levelElement.textContent = "⭐ NIVEAU : 2 (CACAHUÈTE)";
            levelElement.style.color = "#53fc18";
        } else if (currentSubs >= 1) {
            levelElement.textContent = "⭐ NIVEAU : 1 (COFFRE)";
            levelElement.style.color = "#53fc18";
        } else {
            levelElement.textContent = "⭐ NIVEAU : 0";
            levelElement.style.color = "#aaaaaa";
        }

    } catch (err) {
        console.error("Erreur lors de la mise à jour de la jauge :", err);
    }
}

// Lancement au démarrage et actualisation toutes les 3 secondes
loadData();
setInterval(loadData, 3000);
