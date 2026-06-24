const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

let currentFlipped = "NONE";

async function loadData() {
    try {
        // Fetch avec timestamp anti-cache pour une réactivité maximale sur OBS
        const response = await fetch(SHEET_URL + "&t=" + Date.now());
        const csv = await response.text();
        const rows = csv.trim().split("\n");
        const data = {};

        // Extraction des clés/valeurs du Google Sheets
        rows.forEach(row => {
            const firstComma = row.indexOf(",");
            if (firstComma !== -1) {
                const key = row.substring(0, firstComma).replace(/"/g, "").trim().toLowerCase();
                const value = row.substring(firstComma + 1).replace(/"/g, "").trim();
                data[key] = value;
            }
        });

        // 1. Injection dynamique du texte des défis au dos de chaque carte
        if (data["carte_a"]) document.getElementById("contentA").innerHTML = data["carte_a"];
        if (data["carte_b"]) document.getElementById("contentB").innerHTML = data["carte_b"];
        if (data["carte_c"]) document.getElementById("contentC").innerHTML = data["carte_c"];

        // 2. Lecture du déclencheur (A, B, C ou RESET)
        const trigger = (data["carte_trigger"] || "NONE").toUpperCase();

        // Si l'état sur le Sheets a changé, on applique l'animation correspondante
        if (trigger !== currentFlipped) {
            if (trigger === "RESET") {
                // On remet toutes les cartes face cachée (dos visible)
                document.getElementById("cardA").classList.remove("flipped");
                document.getElementById("cardB").classList.remove("flipped");
                document.getElementById("cardC").classList.remove("flipped");
            } else if (trigger === "A") {
                document.getElementById("cardA").classList.add("flipped");
            } else if (trigger === "B") {
                document.getElementById("cardB").classList.add("flipped");
            } else if (trigger === "C") {
                document.getElementById("cardC").classList.add("flipped");
            }
            
            // Mise à jour de l'état local pour éviter de relancer l'animation en boucle
            currentFlipped = trigger;
        }

    } catch (err) {
        console.error("Erreur lors de la synchronisation du Bonneteau :", err);
    }
}

// Premier lancement au chargement de la page
loadData();

// Vérification automatique et mise à jour toutes les 2 secondes
setInterval(loadData, 2000);
