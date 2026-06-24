const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTCtMSWUpqXxoeBYfXO1WhfTgznbB06nu-nMVqEB33F0TgMMHH-31-xAp4PDoR267pHTTKfHakDPmLK/pub?output=csv";

async function refreshData() {
    try {
        const res = await fetch(SHEET_URL + "&t=" + Date.now());
        const data = await res.text();
        const rows = data.split('\n');
        
        rows.forEach(row => {
            const [key, val] = row.split(',');
            if (key && val) {
                const cleanKey = key.trim();
                const cleanVal = val.replace(/"/g, "").trim();

                // 1. Mise à jour du texte des cartes
                if (cleanKey.startsWith("Carte")) {
                    const id = cleanKey.slice(-1).toUpperCase();
                    const el = document.getElementById('content' + id);
                    if (el) el.innerText = cleanVal;
                }

                // 2. Automatisation totale : Retourner la carte via "Choix"
                if (cleanKey === "Choix") {
                    const choix = cleanVal.toUpperCase(); 
                    const targetCard = document.getElementById('card' + choix);
                    
                    // Retourne la carte si elle existe et n'est pas encore retournée
                    if (targetCard && !targetCard.classList.contains('flipped')) {
                        targetCard.classList.add('flipped');
                    }
                }
            }
        });
    } catch(e) { console.error(e); }
}

// Rafraîchissement automatique toutes les 2 secondes
setInterval(refreshData, 2000);
refreshData();
