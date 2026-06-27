let jetonsActuels = -1;


const jauge =
document.getElementById("jauge");


const niveau =
document.getElementById("niveau");


const texte =
document.getElementById("texte");


const lumiere =
document.querySelectorAll(".light");





const sheetURL =

"https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";






function updateJauge(valeur){



jetonsActuels = valeur;



niveau.innerHTML =
valeur+" / 5";



lumiere.forEach((l,index)=>{


l.classList.remove("active");



if(index < valeur){


l.classList.add("active");


}


});





jauge.classList.remove(

"casino",

"interdit",

"jackpot"

);





if(valeur <=2){



jauge.classList.add("casino");


texte.innerHTML="CASINO";


}





else if(valeur <5){



jauge.classList.add("interdit");


texte.innerHTML="SALLE INTERDITE";


}





else{


jauge.classList.add("jackpot");


texte.innerHTML="JACKPOT";



setTimeout(()=>{


jauge.classList.remove("jackpot");

jauge.classList.add("interdit");


texte.innerHTML="SALLE INTERDITE";


},5000);



}



}







async function lireSheet(){



try{


const response =

await fetch(
sheetURL+"?cache="+Date.now()
);



const data =

await response.text();



const result =

data.match(/\d+/);



if(!result)return;



const valeur =

parseInt(result[0]);



if(valeur !== jetonsActuels){


updateJauge(valeur);


}


}


catch(e){


console.log(
"Erreur Google Sheet",
e
);


}



}






setInterval(

lireSheet,

3000

);



lireSheet();
