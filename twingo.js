const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

let endDate = null;

async function loadData(){

    try{

        const response =
            await fetch(
                SHEET_URL +
                "&t=" +
                Date.now()
            );

        const csv =
            await response.text();

        const rows =
            csv.trim().split("\n");

        const data = {};

        rows.forEach(row => {

            const firstComma =
                row.indexOf(",");

            if(firstComma !== -1){

                const key =
                    row.substring(
                        0,
                        firstComma
                    )
                    .replace(/"/g,"")
                    .trim();

                const value =
                    row.substring(
                        firstComma + 1
                    )
                    .replace(/"/g,"")
                    .trim();

                data[key] = value;

            }

        });

        const visible =
            data["Twingo Visible"] ||
            "OFF";

        const end =
            data["Twingo End"] ||
            "";

        const progress =
            data["Twingo Progress"] ||
            "0";

        const missions =
            data["Twingo Missions"] ||
            "0/24";

        document.getElementById(
            "missions"
        ).innerHTML =
            "🎯 " +
            missions +
            " MISSIONS";

        document.getElementById(
            "progressFill"
        ).style.width =
            progress + "%";

        document.getElementById(
            "twingoOverlay"
        ).style.display =
            visible === "ON"
            ? "block"
            : "none";

        if(end){

            endDate =
                new Date(end);

        }

    }catch(err){

        console.error(err);

    }

}

function updateCountdown(){

    if(!endDate){
        return;
    }

    const now =
        new Date();

    let diff =
        endDate - now;

    if(diff <= 0){

        document.getElementById(
            "timer"
        ).innerHTML =
            "🎉 DÉFI TERMINÉ";

        return;

    }

    const hours =
        Math.floor(
            diff /
            (1000 * 60 * 60)
        );

    diff -=
        hours *
        1000 *
        60 *
        60;

    const minutes =
        Math.floor(
            diff /
            (1000 * 60)
        );

    diff -=
        minutes *
        1000 *
        60;

    const seconds =
        Math.floor(
            diff / 1000
        );

    document.getElementById(
        "timer"
    ).innerHTML =
        "⏳ " +
        String(hours)
            .padStart(2,"0")
        + ":" +
        String(minutes)
            .padStart(2,"0")
        + ":" +
        String(seconds)
            .padStart(2,"0");

}

loadData();

setInterval(
    loadData,
    3000
);

setInterval(
    updateCountdown,
    1000
);
