const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

async function loadData() {

    const response = await fetch(CSV_URL);
    const text = await response.text();

    const rows = text.trim().split("\n");

    let currentSubs = 0;
    let targetSubs = 100;

    rows.forEach(row => {

        const cols = row.split(",");

        const key = cols[0]?.trim().toLowerCase();
        const value = cols[1]?.trim();

        if(key === "subs_actuels"){
            currentSubs = parseInt(value);
        }

        if(key === "objectif"){
            targetSubs = parseInt(value);
        }

    });

    const percent = Math.round(
        (currentSubs / targetSubs) * 100
    );

    document.getElementById("fill").style.width =
        percent + "%";

    document.getElementById("percent").textContent =
        percent + "%";

    document.getElementById("counter").textContent =
        `${currentSubs} / ${targetSubs} SUBS`;
}

loadData();
setInterval(loadData,10000);
