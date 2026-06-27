
let jetonsActuels = 0;


const jauge =
document.getElementById("jauge");


const barre =
document.getElementById("barre");


const compteur =
document.getElementById("compteur");





// TON GOOGLE SHEET CSV

const sheetURL =

"https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";





function changerJauge(valeur){


jetonsActuels=valeur;



compteur.innerHTML =
valeur+" / 5";



barre.style.width =
(valeur/5*100)+"%";



jauge.className="";





if(valeur<=2){


jauge.classList.add("casino");


}





if(valeur>=3 && valeur<5){


jauge.classList.add("interdit");


}





if(valeur>=5){


jauge.classList.add("jackpot");



setTimeout(()=>{


jauge.className="interdit";


},5000);


}





}







async function lireGoogleSheet(){


try{


const response =
await fetch(sheetURL);



const data =
await response.text();



const valeur =
parseInt(data.match(/\d+/)[0]);



if(!isNaN(valeur)
&& valeur!==jetonsActuels){


changerJauge(valeur);


}



}


catch(error){


console.log(
"Erreur Google Sheet",
error
);


}


}




setInterval(

lireGoogleSheet,

3000

);



lireGoogleSheet();


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
