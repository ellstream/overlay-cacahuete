const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?output=csv";

async function loadData(){

    try{

        const response = await fetch(
            SHEET_URL + "&t=" + Date.now()
        );

        const csv = await response.text();

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

        /* =========================
           MEGA SPIN
        ========================= */

        const megaText =
            data["Mega Spin"] || "0/5";

        document.getElementById("mega").innerText =
            "🎰 Mega Spin : " + megaText;

        const megaValue =
            Number(megaText.split("/")[0]) || 0;

        const objectif =
            Number(megaText.split("/")[1]) || 5;

        const restant =(
            Math.max(0, objectif - megaValue);

     document.getElementById("megaRemaining").innerText =
    "⭐ Objectif=" + objectif +
    " | Actuel=" + megaValue +
    " | Restant=" + restant;

        if(megaValue >= objectif){

            document.getElementById("megaReady").style.display =
                "block";

        }else{

            document.getElementById("megaReady").style.display =
                "none";

        }

        /* =========================
           GOLDEN TICKETS
        ========================= */

        document.getElementById("golden").innerText =
            "🎟 Golden Tickets : " +
            (data["Golden Tickets"] || "0");

        /* =========================
           ROI
        ========================= */

        document.getElementById("roi").innerText =
            "👑 Roi : " +
            (data["Roi"] || "Aucun");

        /* =========================
           VIEWERS BAR
        ========================= */

        let verif =
            data["Vérification"] ||
            data["Viewers"] ||
            "0/50";

        verif = verif.replace(/\s/g, "");

        document.getElementById("viewersText").innerText =
            "🚀 " + verif + " viewers";

        const current =
            Number(verif.split("/")[0]) || 0;

        const max =
            Number(verif.split("/")[1]) || 50;

        const percent =
            Math.min(
                (current / max) * 100,
                100
            );

        document.getElementById("bar").style.width =
            percent + "%";

    }catch(err){

        console.error(
            "Erreur Google Sheet :",
            err
        );

    }

}

loadData();

setInterval(
    loadData,
    3000
);
