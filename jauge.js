const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";

async function loadData(){

let jetons = 0;

try{

const response =
await fetch(SHEET_URL + "&t=" + Date.now());

const csv =
await response.text();

const rows =
csv.trim().split("\n");

rows.forEach(row=>{

const parts=row.split(",");

if(parts.length<2) return;

const key=
parts[0]
.replace(/"/g,"")
.trim()
.toLowerCase();

if(key.includes("jeton")){

jetons=
parseInt(parts[1])||0;

}

});

}catch(err){

console.error(err);

}

jetons=Math.min(Math.max(jetons,0),5);

document.getElementById("jetonsCount").textContent=
jetons;

document.getElementById("barFill").style.width=
(jetons/5)*100+"%";

const box=document.getElementById("casinoBox");

const status=document.getElementById("status");

box.classList.remove("red-mode");
box.classList.remove("jackpot");

/* ========================= */
/* 0 à 2 */
/* ========================= */

if(jetons<3){

status.innerHTML=
"🎰 Collecte des jetons...";

}

/* ========================= */
/* 3 à 4 */
/* ========================= */

if(jetons>=3){

box.classList.add("red-mode");

status.innerHTML=
"🚪 SALLE INTERDITE DÉBLOQUÉE";

}

/* ========================= */
/* 5 */
/* ========================= */

if(jetons>=5){

box.classList.remove("red-mode");

box.classList.add("jackpot");

status.innerHTML=
"👑 SALLE SECRÈTE + JACKPOT";

}

}

loadData();

setInterval(loadData,3000);
