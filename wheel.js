const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

const prizes = [
"Golden Ticket x1",
"Manger un piment",
"Aller chez Nestor",
"Monter le Terril",
"24h dans la Twingo",
"Relance",
"Défi du Chat",
"Handicap de jeu",
"Chanter en live",
"Golden Ticket x2",
"Voix Cacahuète",
"Re-Spin Bonus"
];

let spinning = false;

async function loadData(){

    try{

        const response =
            await fetch(
                SHEET_URL + "&t=" + Date.now()
            );

        const csv = await response.text();

        const rows = csv.trim().split("\n");

        const data = {};

        rows.forEach(row => {

            const firstComma =
                row.indexOf(",");

            if(firstComma !== -1){

                const key =
                    row.substring(
                        0,
                        firstComma
                    ).trim();

                const value =
                    row.substring(
                        firstComma + 1
                    )
                    .replace(/"/g,"")
                    .trim();

                data[key] = value;
            }

        });

        const trigger =
            data["Spin Trigger"] || "OFF";

        const result =
            data["Spin Result"] || "Random";

        if(
            trigger === "GO" &&
            spinning === false
        ){

            launchSpin(result);

        }

    }catch(err){

        console.error(err);

    }

}

function launchSpin(forcedResult){

    spinning = true;

    const wheel =
        document.getElementById("wheel");

    let prizeIndex;

    if(
        forcedResult &&
        forcedResult !== "Random"
    ){

        prizeIndex =
            prizes.indexOf(forcedResult);

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

    const segmentAngle =
        360 / prizes.length;

    const rotation =
        (360 * 8) +
        (360 -
        (prizeIndex * segmentAngle) -
        (segmentAngle / 2));

    wheel.style.transform =
        `rotate(${rotation}deg)`;

    setTimeout(() => {

        document
        .getElementById("result")
        .innerText =
            "🏆 " +
            prizes[prizeIndex];

        spinning = false;

    },8000);

}

loadData();

setInterval(loadData,3000);
