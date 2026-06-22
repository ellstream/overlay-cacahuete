const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSScVihkW4AxYZ2yvxfcKHDaYDkJTq6BRVuGscjPq1HLVL8YaiT5DGpLRnzI3T-hcjwIYmtCnUsSPG1/pub?gid=0&single=true&output=csv";

async function loadData() {

    try {

        const response = await fetch(CSV_URL);

        const text = await response.text();

        const rows = text.trim().split("\n");

        const values = rows[1].split(",");

        const currentSubs = parseInt(values[0]);
        const targetSubs = parseInt(values[1]);

        const percent =
            Math.round((currentSubs / targetSubs) * 100);

        document.getElementById("fill")
            .style.width = percent + "%";

        document.getElementById("percent")
            .textContent = percent + "%";

        document.getElementById("counter")
            .textContent =
            `${currentSubs} / ${targetSubs} SUBS`;

    }

    catch(error){

        console.error(error);

    }
}

loadData();

setInterval(loadData, 10000);
