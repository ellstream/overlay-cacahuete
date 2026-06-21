const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/TON-LIEN/pub?gid=0&single=true&output=csv";

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
            data["Twingo Visible"] || "OFF";

        const timer =
            data["Twingo Time"] || "24:00:00";

        const progress =
            data["Twingo Progress"] || "0";

        const missions =
            data["Twingo Missions"] || "0/24";

        const roi =
            data["Roi"] || "---";

        const tickets =
            data["Golden Tickets"] || "0";

        document.getElementById(
            "timer"
        ).innerHTML = "⏳ " + timer;

        document.getElementById(
            "missions"
        ).innerHTML =
            "🎯 " + missions + " MISSIONS";

        document.getElementById(
            "roi"
        ).innerHTML =
            "👑 Roi : " + roi;

        document.getElementById(
            "tickets"
        ).innerHTML =
            "🎟️ Tickets : " + tickets;

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

    }catch(err){

        console.error(err);

    }

}

loadData();

setInterval(
    loadData,
    3000
);
