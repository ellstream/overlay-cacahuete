const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTCtMSWUpqXxoeBYfXO1WhfTgznbB06nu-nMVqEB33F0TgMMHH-31-xAp4PDoR267pHTTKfHakDPmLK/pub?output=csv";

async function refreshData() {
    try {
        const res = await fetch(SHEET_URL + "&t=" + Date.now());
        const data = await res.text();
        const rows = data.split('\n');
        
        rows.forEach(row => {
            const [key, val] = row.split(',');
            if (key && val) {
                const el = document.getElementById('content' + key.trim().slice(-1).toUpperCase());
                if (el) el.innerText = val.replace(/"/g, "");
            }
        });
    } catch(e) { console.error(e); }
}

function flipCard(id) {
    document.getElementById('card' + id).classList.toggle('flipped');
}

setInterval(refreshData, 2000);
refreshData();
