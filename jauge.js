const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

let alerteDeclenchee = false;

async function loadData() {
    try {
        const response = await fetch(SHEET_URL + "&t=" + Date.now());
        const csv = await response.text();
        const rows = csv.trim().split("\n");
        
        let currentSubs = 0;
        let targetSubs = 5;

        rows.forEach(row => {
            const firstComma = row.indexOf(",");
            if (firstComma !== -1) {
                const key = row.substring(0, firstComma).replace(/"/g, "").trim().toLowerCase();
                const value = row.substring(firstComma + 1).replace(/"/g, "").trim();

                if (key === "subs_actuels") currentSubs = parseInt(value) || 0;
                if (key === "objectif") targetSubs = parseInt(value) || 5;
            }
        });

        if (currentSubs > targetSubs) currentSubs = targetSubs;
        const percent = Math.round((currentSubs / targetSubs) * 100);

        document.getElementById("progressBarFill").style.width = percent + "%";
        document.getElementById("progressText").textContent = `${currentSubs} / ${targetSubs} SUBS`;

        const levelElement = document.getElementById("casinoLevel");
        const popup = document.getElementById("popupAlerte");
        
        if (currentSubs >= 5) {
            levelElement.textContent = "🚨 JACKPOT PRÊT !";
            levelElement.style.color = "#ff3333";
            alerteDeclenchee = false; // Reset pour la prochaine session
        } 
        else if (currentSubs >= 4) {
            levelElement.textContent = "⚡ NIVEAU : 4 (LA FIÈVRE)";
            levelElement.style.color = "#ff5500";
            
            // DÉCLENCHEMENT DE L'ALERTE GÉANTE VISUELLE
            if (!alerteDeclenchee) {
                alerteDeclenchee = true;
                popup.innerHTML = "🎰 LA FIÈVRE DU CASINO 🎰<br><span style='font-size:20px; color:#ffaa00;'>DOUBLE OU QUITTE EN COURS !</span>";
                popup.classList.add("show");
                
                // Le pop-up disparaît tout seul après 5 secondes
                setTimeout(() => {
                    popup.classList.remove("show");
                }, 5000);
            }
        } 
        else if (currentSubs >= 3) {
            levelElement.textContent = "⭐ NIVEAU : 3 (INTERDIT)";
            levelElement.style.color = "#ffaa00";
            alerteDeclenchee = false;
        } 
        else if (currentSubs >= 2) {
            levelElement.textContent = "⭐ NIVEAU : 2 (CACAHUÈTE)";
            levelElement.style.color = "#53fc18";
            alerteDeclenchee = false;
        } 
        else if (currentSubs >= 1) {
            levelElement.textContent = "⭐ NIVEAU : 1 (COFFRE)";
            levelElement.style.color = "#53fc18";
            alerteDeclenchee = false;
        } 
        else {
            levelElement.textContent = "⭐ NIVEAU : 0";
            levelElement.style.color = "#aaaaaa";
            alerteDeclenchee = false;
        }

    } catch (err) {
        console.error("Erreur jauge :", err);
    }
}

loadData();
setInterval(loadData, 3000);
