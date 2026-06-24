const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";

let dernierPalierAlerte = 0; // Bloque la répétition des animations
let intervalleBillets = null;

function declencherPluieBillets() {
    // Si une pluie tourne déjà, on ne la duplique pas
    if (intervalleBillets) return;

    const container = document.getElementById("confetti-container");
    const items = ["💵", "💰", "💸", "🪙", "🎰", "🥜"];

    intervalleBillets = setInterval(() => {
        const billet = document.createElement("div");
        billet.className = "money-drop";
        billet.innerHTML = items[Math.floor(Math.random() * items.length)];
        
        // Configuration aléatoire pour un effet naturel
        billet.style.left = Math.random() * 100 + "vw";
        const dureeTombe = Math.random() * 2 + 2; // Entre 2s et 4s
        billet.style.animation = `fallDown ${dureeTombe}s linear forwards`;
        billet.style.fontSize = Math.random() * 20 + 24 + "px"; // Taille variée

        container.appendChild(billet);

        // Nettoyage de l'élément après sa chute
        setTimeout(() => {
            billet.remove();
        }, dureeTombe * 1000);
    }, 120); // Fréquence d'apparition intense
}

function stopperPluieBillets() {
    if (intervalleBillets) {
        clearInterval(intervalleBillets);
        intervalleBillets = null;
    }
}

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

        // Update visuel de la jauge
        const barFill = document.getElementById("progressBarFill");
        barFill.style.width = percent + "%";
        document.getElementById("progressText").textContent = `${currentSubs} / ${targetSubs} SUBS`;

        const levelElement = document.getElementById("casinoLevel");
        const popup = document.getElementById("popupAlerte");
        
        // ==========================================
        // CONFIGURATION DES SYSTEMES DE PALIERS
        // ==========================================
        
        if (currentSubs >= 5) {
            levelElement.textContent = "🚨 JACKPOT PRÊT !";
            levelElement.style.color = "#ff0033";
            barFill.style.backgroundColor = "#ff0033"; // La jauge vire au rouge alerte
            barFill.style.boxShadow = "0 0 15px #ff0033";

            if (dernierPalierAlerte !== 5) {
                dernierPalierAlerte = 5;
                
                // Pop-up d'impact Palier 5
                popup.className = "theme-palier5 show";
                popup.innerHTML = "🚨 JACKPOT DISPONIBLE ! 🚨<br><span style='font-size:22px; color:#fff;'>BRAQUAGE DU CASINO EN COURS !</span>";
                
                declencherPluieBillets();

                // Le pop-up s'efface après 7 secondes, mais la pluie continue de tourner
                setTimeout(() => {
                    popup.classList.remove("show");
                }, 7000);
            }
        } 
        else if (currentSubs >= 4) {
            levelElement.textContent = "⚡ NIVEAU : 4 (LA FIÈVRE)";
            levelElement.style.color = "#ff5500";
            barFill.style.backgroundColor = "#53fc18";
            barFill.style.boxShadow = "0 0 12px #53fc18";
            stopperPluieBillets();

            if (dernierPalierAlerte !== 4) {
                dernierPalierAlerte = 4;
                
                // Pop-up d'impact Palier 4
                popup.className = "theme-palier4 show";
                popup.innerHTML = "🎰 LA FIÈVRE DU CASINO 🎰<br><span style='font-size:20px; color:#ffaa00;'>DOUBLE OU QUITTE EN COURS !</span>";
                
                setTimeout(() => {
                    popup.classList.remove("show");
                }, 5000);
            }
        } 
        else {
            // Reset des animations pour les paliers inférieurs (0, 1, 2, 3)
            stopperPluieBillets();
            popup.classList.remove("show");
            dernierPalierAlerte = currentSubs;
            
            barFill.style.backgroundColor = "#53fc18";
            barFill.style.boxShadow = "0 0 12px #53fc18";

            if (currentSubs >= 3) {
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
        }

    } catch (err) {
        console.error("Erreur jauge :", err);
    }
}

loadData();
setInterval(loadData, 3000);
