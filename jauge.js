const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTCtMSWUpqXxoeBYfXO1WhfTgznbB06nu-nMVqEB33F0TgMMHH-31-xAp4PDoR267pHTTKfHakDPmLK/pub?output=csv";
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
                
                // Si la ligne commence par "Jetons_Casino", on ajoute la valeur à totalJetons
                if (key.startsWith("Jetons_Casino")) {
                    totalJetons += value;
                }
            }
        });

        // Mise à jour de l'affichage
        const jetons = Math.min(5, totalJetons); // Limite max à 5
        document.getElementById("counter").innerHTML = `🪙 ${jetons} / 5`;
        document.getElementById("barFill").style.width = (jetons / 5) * 100 + "%";

        const status = document.getElementById("status");
        if (jetons >= 5) status.innerHTML = "👑 SALLE SECRÈTE DÉBLOQUÉE";
        else if (jetons >= 3) status.innerHTML = "🚪 SALLE INTERDITE DÉBLOQUÉE";
        else status.innerHTML = "Collecte en cours...";

    } catch(err) {
        console.error("Erreur :", err);
    }
}
loadData();
setInterval(loadData, 3000);
