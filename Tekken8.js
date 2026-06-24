const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYpO5M5w8fIsav1NY5tUj9JR8kEdtfrjc_qPUd8BVYRDCfzJQ1TY9Z9npR4naD2CR752yZAZqJL2U6/pub?output=csv";

const prizes = [
    "🥊 OLD SCHOOL...ZÉRO HEAT SYSTEM",
    "🎯 SPAM TACTIQUE...5 FOIS LE MÊME COUP",
    "🎮 NOOB MODE...COMMANDES SPÉCIALES",
    "🤫 MUTISME...INTERDIT DE PARLER",
    "🕶️ SPECTATEUR...SANS LUNETTES DE SOLEIL",
    "🤬 KI CHARGE...L'IRRESPECT TOTAL",
    "🐼 PANDA / KUMA...LE PIRE PERSO",
    "🙈 ÉCRAN FANTÔME...PAS DE BARRE DE VIE",
    "❤️‍🩹 COMEBACK...ATTENDRE LA RAGE",
    "🐦 TWITTER DRAMA...RAGE QUIT VIRTUEL",
    "🎁 BONUS...SUB GIFT AU CHAT",
    "🔄 ReSpin"
];

const colors = [
    "#53fc18","#0f0f0f",
    "#53fc18","#0f0f0f",
    "#53fc18","#0f0f0f",
    "#53fc18","#0f0f0f",
    "#53fc18","#0f0f0f",
    "#53fc18","#0f0f0f"
];

let spinning = false;
let lastTrigger = "OFF";

function polarToCartesian(cx, cy, r, angle) {
    const rad = (angle - 90) * Math.PI / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
    };
}

function launchConfetti() {
    const container = document.getElementById("confetti");
    const emojis = ["💸", "📈", "🥜", "🤡", "💀", "🔥"];
    if(!container) return;

    for (let i = 0; i < 60; i++) {
        const el = document.createElement("div");
        el.className = "sparkle";
        el.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + "%";
        container.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }
}

function createWheel() {
    const centerX = 400;
    const centerY = 400;
    const radius = 350; // Diamètre total étendu pour la roue de 850px
    const angleSize = 360 / prizes.length;

    // On s'assure de cibler le groupe ou la roue pour appliquer les éléments au bon endroit
    const wheelGroup = document.getElementById("wheelGroup") || document.getElementById("wheel");

    for (let i = 0; i < prizes.length; i++) {
        const startAngle = i * angleSize;
        const endAngle = startAngle + angleSize;

        const start = polarToCartesian(centerX, centerY, radius, endAngle);
        const end = polarToCartesian(centerX, centerY, radius, startAngle);

        const pathData = [
            "M", centerX, centerY,
            "L", start.x, start.y,
            "A", radius, radius, 0, 0, 0, end.x, end.y,
            "Z"
        ].join(" ");

        const seg = document.getElementById("seg" + i);
        if (seg) {
            seg.setAttribute("d", pathData);
            seg.setAttribute("fill", colors[i]);
            seg.setAttribute("stroke", "#53fc18");
            seg.setAttribute("stroke-width", "4");
        }

        const middleAngle = startAngle + angleSize / 2;
        
        // Positionnement idéal pour la taille de 850px (dégage le logo central)
        const textPos = polarToCartesian(centerX, centerY, 255, middleAngle);

        const txt = document.getElementById("txt" + i);
        if (txt) {
            txt.setAttribute("x", textPos.x);
            txt.setAttribute("y", textPos.y);
            txt.setAttribute("transform", `rotate(${middleAngle + 90} ${textPos.x} ${textPos.y})`);
            txt.innerHTML = ""; // On vide le texte précédent avant de réinjecter

            const label = prizes[i];
            const words = label.split(" ");
            
            // DÉCOUPAGE CHIRURGICAL SUR 3 LIGNES COMPACTES
            if (words.length >= 4 && label.length > 15) {
                const totalWords = words.length;
                const part = Math.ceil(totalWords / 3);
                
                const line1 = words.slice(0, part).join(" ");
                const line2 = words.slice(part, part * 2).join(" ");
                const line3 = words.slice(part * 2).join(" ");

                // Ligne 1
                const tspan1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                tspan1.setAttribute("x", textPos.x);
                tspan1.setAttribute("dy", "-10"); 
                tspan1.textContent = line1;

                // Ligne 2
                const tspan2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                tspan2.setAttribute("x", textPos.x);
                tspan2.setAttribute("dy", "11"); 
                tspan2.textContent = line2;

                // Ligne 3
                const tspan3 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                tspan3.setAttribute("x", textPos.x);
                tspan3.setAttribute("dy", "11"); 
                tspan3.textContent = line3;

                txt.appendChild(tspan1);
                txt.appendChild(tspan2);
                txt.appendChild(tspan3);
            } else if (label.length > 12) {
                // Découpage de sécurité sur 2 lignes si texte moyen
                const mid = Math.ceil(words.length / 2);
                const line1 = words.slice(0, mid).join(" ");
                const line2 = words.slice(mid).join(" ");

                const tspan1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                tspan1.setAttribute("x", textPos.x);
                tspan1.setAttribute("dy", "-5");
                tspan1.textContent = line1;

                const tspan2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                tspan2.setAttribute("x", textPos.x);
                tspan2.setAttribute("dy", "12");
                tspan2.textContent = line2;

                txt.appendChild(tspan1);
                txt.appendChild(tspan2);
            } else {
                // Une seule ligne pour les textes courts (ex: ReSpin)
                txt.textContent = label;
            }
        }
    }
}

async function loadData() {
    try {
        const response = await fetch(SHEET_URL + "&t=" + Date.now());
        const csv = await response.text();
        const rows = csv.trim().split("\n");
        const data = {};

        rows.forEach(row => {
            const firstComma = row.indexOf(",");
            if (firstComma !== -1) {
                const key = row.substring(0, firstComma).replace(/"/g, "").trim().toLowerCase();
                const value = row.substring(firstComma + 1).replace(/"/g, "").trim();
                data[key] = value;
            }
        });

        const trigger = data["scam trigger"] || "OFF";
        const forcedResult = data["scam result"] || "Random";

        if (trigger === "GO" && lastTrigger !== "GO" && !spinning) {
            launchSpin(forcedResult);
        }

        lastTrigger = trigger;
    } catch (err) {
        console.error(err);
    }
}

function launchSpin(forcedResult) {
    spinning = true;
    
    const resultBox = document.getElementById("resultBox");
    if (resultBox) {
        resultBox.classList.remove("win");
        resultBox.innerHTML = "🎰 LE SCAM EST EN COURS...";
    }

    const wheel = document.getElementById("wheel");
    let prizeIndex;

    if (forcedResult !== "Random") {
        prizeIndex = prizes.indexOf(forcedResult);
        if (prizeIndex === -1) {
            prizeIndex = Math.floor(Math.random() * prizes.length);
        }
    } else {
        prizeIndex = Math.floor(Math.random() * prizes.length);
    }

    const angleSize = 360 / prizes.length;
    const finalAngle = (360 * 8) + (360 - (prizeIndex * angleSize) - (angleSize / 2));

    if (wheel) wheel.style.transform = `rotate(${finalAngle}deg)`;

    setTimeout(() => {
        if (resultBox) {
            resultBox.innerHTML = "🏆 " + prizes[prizeIndex];
            resultBox.classList.add("win");
        }
        launchConfetti();
        spinning = false;
    }, 8000);
}

createWheel();
loadData();
setInterval(loadData, 3000);
