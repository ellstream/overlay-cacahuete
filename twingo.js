const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

let startDate = null;
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

        const start =
            data["Twingo Start"] ||
            "";

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

        if(start){

            startDate =
                new Date(start);

        }

        if(end){

            endDate =
                new Date(end);

        }

    }catch(err){

        console.error(err);

    }

}

function formatTime(ms){

    const hours =
        Math.floor(
            ms /
            (1000 * 60 * 60)
        );

    ms -=
        hours *
        1000 *
        60 *
        60;

    const minutes =
        Math.floor(
            ms /
            (1000 * 60)
        );

    ms -=
        minutes *
        1000 *
        60;

    const seconds =
        Math.floor(
            ms / 1000
        );

    return (
        String(hours)
            .padStart(2,"0")
        + ":" +
        String(minutes)
            .padStart(2,"0")
        + ":" +
        String(seconds)
            .padStart(2,"0")
    );

}

function updateCountdown(){

    if(
        !startDate ||
        !endDate
    ){
        return;
    }

    const now =
        new Date();

    const timer =
        document.getElementById(
            "timer"
        );

    if(now < startDate){

        const diff =
            startDate - now;

        timer.innerHTML =
            "🚀 COMMENCE DANS<br>" +
            formatTime(diff);

        return;

    }

    if(
        now >= startDate &&
        now < endDate
    ){

        const diff =
            endDate - now;

        timer.innerHTML =
            "⏳ " +
            formatTime(diff);

        return;

    }

    timer.innerHTML =
        "🎉 DÉFI TERMINÉ";

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
