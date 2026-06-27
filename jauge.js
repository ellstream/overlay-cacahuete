let jetonsActuels = -1;

const jauge =
document.getElementById("jauge");


const barre =
document.getElementById("barre");


const compteur =
document.getElementById("compteur");



// TON GOOGLE SHEET

const sheetURL =

"https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";





function changerJauge(valeur){


jetonsActuels = valeur;



compteur.innerHTML =
valeur+" / 5";



barre.style.width =
(valeur/5*100)+"%";



jauge.classList.remove(

"casino",

"interdit",

"jackpot"

);




if(valeur <=2){


jauge.classList.add("casino");


}



else if(valeur <5){


jauge.classList.add("interdit");


}



else{


jauge.classList.add("jackpot");



setTimeout(()=>{


jauge.classList.remove("jackpot");

jauge.classList.add("interdit");


},5000);


}


}




async function lireJetons(){


try{


const response =
await fetch(sheetURL+"?t="+Date.now());


const data =
await response.text();



const nombre =
data.match(/\d+/);



if(!nombre)return;



const valeur =
parseInt(nombre[0]);



if(valeur!==jetonsActuels){


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

lireJetons,

3000

);



lireJetons();
