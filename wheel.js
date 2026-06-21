const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

const prizes = [
"Golden Ticket x1",
"Piment Infernal",
"Seau Glacé",
"Défi Supérette",
"24h dans la Twingo",
"Golden Ticket x2",
"Handicap Extrême",
"Karaoké de la Honte",
"Le Chat Choisit Ton Repas",
"Relance",
"Roi du Casino",
"Jackpot Cacahuète"
];

const colors = [
"#d4af37",
"#2d2d2d",
"#53fc18",
"#121212",
"#d4af37",
"#2d2d2d",
"#53fc18",
"#121212",
"#d4af37",
"#2d2d2d",
"#53fc18",
"#121212"
];

let spinning = false;
let lastTrigger = "OFF";

function polarToCartesian(cx, cy, r, angle){
    const rad = (angle - 90) * Math.PI / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
    };
}

function createWheel(){

    const centerX = 400;
    const centerY = 400;
    const radius = 380;

    const angleSize = 360 / prizes.length;

    for(let i=0;i<prizes.length;i++){

        const startAngle = i * angleSize;
        const endAngle = startAngle + angleSize;

        const start =
            polarToCartesian(
                centerX,
                centerY,
                radius,
                endAngle
            );

        const end =
            polarToCartesian(
                centerX,
                centerY,
                radius,
                startAngle
            );

        const pathData = [
            "M", centerX, centerY,
            "L", start.x, start.y,
            "A", radius, radius, 0, 0, 0,
            end.x, end.y,
            "Z"
        ].join(" ");

        const seg =
            document.getElementById(
                "seg" + i
            );

        seg.setAttribute("d", pathData);
        seg.setAttribute("fill", colors[i]);
        seg.setAttribute("stroke", "#53fc18");
        seg.setAttribute("stroke-width", "3");

        const middleAngle =
            startAngle + angleSize / 2;

        const textPos =
            polarToCartesian(
                centerX,
                centerY,
                290,
                middleAngle
            );

        const txt =
            document.getElementById(
                "txt" + i
            );

        txt.setAttribute(
            "x",
            textPos.x
        );

        txt.setAttribute(
            "y",
            textPos.y
        );

        txt.setAttribute(
            "transform",
            `rotate(${middleAngle + 90 + -8} ${textPos.x} ${textPos.y})`
        );

        txt.textContent =
            prizes[i];
    }
}

async function loadData(){

    try{

        const response = await fetch(
            SHEET_URL + "&t=" + Date.now()
        );

        const csv = await response.text();

        console.log(csv);

        const rows = csv.trim().split("\n");

        const data = {};

        rows.forEach(row => {

            const firstComma = row.indexOf(",");

            if(firstComma !== -1){

                const key = row.substring(0, firstComma)
                    .replace(/"/g,"")
                    .trim();

                const value = row.substring(firstComma + 1)
                    .replace(/"/g,"")
                    .trim();

                data[key] = value;
            }

        });

        console.log("Objet data :");
        console.log(JSON.stringify(data, null, 2));

        const trigger =
            data["Spin Trigger"] || "OFF";

        const forcedResult =
            data["Spin Result"] || "Random";

        if(
            trigger === "GO" &&
            lastTrigger !== "GO" &&
            spinning === false
        ){

            launchSpin(forcedResult);

        }

        lastTrigger = trigger;

    } catch(err){

        console.error(err);

    }

    }

function launchSpin(forcedResult){

    spinning = true;

    document.getElementById(
        "megaSpinContainer"
    ).style.display = "flex";

  const wheel =
    document.getElementById("wheel");
    
    let prizeIndex;

    if(forcedResult !== "Random"){

        prizeIndex =
            prizes.indexOf(
                forcedResult
            );

        if(prizeIndex === -1){

            prizeIndex =
                Math.floor(
                    Math.random() *
                    prizes.length
                );

        }

    }else{

        prizeIndex =
            Math.floor(
                Math.random() *
                prizes.length
            );

    }

    const angleSize =
        360 / prizes.length;

    const finalAngle =
        (360 * 8)
        +
        (
            360
            -
            (prizeIndex * angleSize)
            -
            (angleSize / 2)
        );

wheel.style.transform =
    `rotate(${finalAngle}deg)`;
    
    setTimeout(()=>{

        const resultBox =
            document.getElementById(
                "resultBox"
            );

        resultBox.innerHTML =
            "🏆 " +
            prizes[prizeIndex];

        resultBox.classList.add(
            "win"
        );

        spinning = false;

        setTimeout(()=>{

            document.getElementById(
                "megaSpinContainer"
            ).style.display = "none";

        },5000);

     },8000);

}

createWheel();

loadData();

setInterval(
    loadData,
    3000
);
