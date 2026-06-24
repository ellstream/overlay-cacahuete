const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

const prizes = [
    "📜 10 MIN DE SILENCE...MUTISME LÉGENDAIRE",
    "🌶️🔥 PIMENT INFERNAL...LARME DE FEU",
    "💰🥤 SEAU D’OR...JACKPOT LIQUIDE",
    "🏪 DÉFI SUPÉRETTE...MISSION IMPOSSIBLE",
    "🎮💢 TEKKEN RAGE...COMBO CATASTROPHE",
    "📸🤮 SELFIE MOCHE...PHOTO DOSSIER",
    "🧹😴 DÉFI MÉNAGE...CENDRILLON",
    "🛌💤 DÉFI SIESTE...COMA EXPRESS",
    "🥤💦 JE BOIS UN VERRE...GLUGLU MASTER",
    "🥜🎉 JACKPOT CACAHUÈTE : TRÉSOR DU STREAM",
    "🎯💥 PUNCHLINE...VANNE NUCLÉAIRE",
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
    if (!container) return;

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
    const radius = 330;
    // Rayon sur lequel le texte va s'arrondir (pile au milieu de la tranche)
    const textRadius = 240; 
    const angleSize = 360 / prizes.length;
    const svg = document.querySelector("svg");

    // Nettoyage ou création du bloc <defs> pour stocker les chemins du texte courbe
    let defs = svg.querySelector("defs");
    if (!defs) {
        defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        svg.insertBefore(defs, svg.firstChild);
    } else {
        defs.innerHTML = "";
    }

    for (let i = 0; i < prizes.length; i++) {
        const startAngle = i * angleSize;
        const endAngle = startAngle + angleSize;

        // 1. Dessin de la tranche de la roue
        const start = polarToCartesian(centerX, centerY, radius, endAngle);
        const end = polarToCartesian(centerX, centerY, radius, startAngle);

        const pathData = [
            "M", centerX, centerY,
            "L", start.x, start.y,
            "A", radius, radius, 0, 0, 0, end.x, end.y,
            "Z"
        ].join(" ");

        const seg = document.getElementById("seg" + i);
        seg.setAttribute("d", pathData);
        seg.setAttribute("fill", colors[i]);
        seg.setAttribute("stroke", "#53fc18");
        seg.setAttribute("stroke-width", "4");

        // 2. Création de la trajectoire invisible en arc de cercle pour le texte
        const textStart = polarToCartesian(centerX, centerY, textRadius, startAngle);
        const textEnd = polarToCartesian(centerX, centerY, textRadius, endAngle);
        
        // Arc orienté de gauche à droite pour que le texte s'affiche à l'endroit
        const pathTextData = [
            "M", textStart.x, textStart.y,
            "A", textRadius, textRadius, 0, 0, 1, textEnd.x, textEnd.y
        ].join(" ");

        const pathId = `textPath${i}`;
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("id", pathId);
        pathElement.setAttribute("d", pathTextData);
        pathElement.setAttribute("fill", "none");
        defs.appendChild(pathElement);

        // 3. Application du texte sur le chemin courbé
        const txt = document.getElementById("txt" + i);
        txt.innerHTML = "";
        // Reset des attributs devenus inutiles avec le TextPath
        txt.removeAttribute("x");
        txt.removeAttribute("y");
        txt.removeAttribute("transform");

        const textPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
        textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${pathId}`);
        textPath.setAttribute("startOffset", "50%"); // Centre parfaitement le texte au milieu de l'arc
        textPath.textContent = prizes[i];
        
        txt.appendChild(textPath);
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
    // On ajoute un décalage de 90 degrés pour compenser le repère de l'aiguille en haut
    const finalAngle = (360 * 8) + (360 - (prizeIndex * angleSize) - (angleSize / 2)) - 90;

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
