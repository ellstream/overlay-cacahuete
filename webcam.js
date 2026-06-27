let niveauActuel = -1;

let jackpot = false;


const frame =
document.getElementById("webcam-frame");


const message =
document.getElementById("message");


const coins =
document.getElementById("coins");



const sheetURL =

"https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";





function updateWebcam(value){


niveauActuel=value;



frame.className="";



if(value<=2){


frame.classList.add("casino");


}



else if(value<5){


frame.classList.add("interdit");


}


else{


launchJackpot();


}



}





function launchJackpot(){


if(jackpot)return;


jackpot=true;



frame.classList.add("jackpot");



createCoins();



setTimeout(()=>{


frame.classList.remove("jackpot");


frame.classList.add("interdit");


jackpot=false;


},5000);



}




function createCoins(){


coins.innerHTML="";


for(let i=0;i<50;i++){


let c=document.createElement("div");


c.className="coin";


c.innerHTML="🪙";


c.style.left=Math.random()*600+"px";


c.style.animationDelay=

Math.random()*2+"s";


coins.appendChild(c);



}



}





async function readSheet(){


try{


const response=

await fetch(sheetURL+"&cache="+Date.now());


const csv=

await response.text();



console.log(
"Google Sheet webcam:",
csv
);



const values=

csv.match(/\b[0-5]\b/g);



if(!values)return;



const value=

parseInt(values[0]);



if(value!==niveauActuel){


updateWebcam(value);


}



}


catch(e){

console.log(e);

}



}





setInterval(
readSheet,
3000
);



readSheet();
