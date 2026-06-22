// URL de votre publication CSV Google Sheets
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

async function fetchData() {
    try {
        // Récupération du fichier CSV
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        
        // Séparation des lignes du CSV
        const rows = csvText.split('\n');
        
        // Modification ici : rows[17] cible directement la LIGNE 18 de ton Google Sheet
        const data = rows[18].split(','); 

        // Extraction des données depuis la ligne 18 (A18, B18, C18, D18, E18)
        const current = parseInt(data[0]) || 0;       // Colonne A18 : Subs actuels
        const goal = parseInt(data[1]) || 100;        // Colonne B18 : Objectif Max (ex: 50)
        const lastSub = data[2] ? data[2].trim() : "---"; // Colonne C18 : Pseudo du dernier Sub
        const eventTime = data[3] ? data[3].trim() : "--:--"; // Colonne D18 : Heure de l'event
        const ticketCount = data[4] ? data[4].trim() : "0"; // Colonne E18 : Nombre de tickets

        // Calcul du pourcentage pour la jauge (bloqué entre 0% et 100%)
        const percent = Math.min(Math.round((current / goal) * 100), 100);
        
        // Injection dynamique dans le HTML
        document.getElementById('progressBar').style.width = percent + "%";
        document.getElementById('percentText').innerText = percent + "%";
        document.getElementById('currentSubs').innerText = current;
        document.getElementById('maxSubs').innerText = goal;
        document.getElementById('lastSub').innerText = lastSub;
        document.getElementById('nextEvent').innerText = eventTime;
        document.getElementById('tickets').innerText = ticketCount;

        console.log(`Mise à jour Ligne 18 réussie : ${percent}% (${current}/${goal})`);

    } catch (error) {
        console.error("Erreur lors de la récupération ou du traitement des données CSV :", error);
    }
}

// Rafraîchissement automatique toutes les 5 secondes
setInterval(fetchData, 5000);

// Premier lancement au chargement
fetchData();
