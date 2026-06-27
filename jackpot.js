// ==========================================
// CASINO VAULT - JACKPOT
// ==========================================

let dernierNiveau = -1;
let jackpotActif = false;

// ==========================================
// ELEMENTS
// ==========================================

const title =
document.querySelector("#title");

const subtitle =
document.querySelector("#subtitle");
const overlay = document.getElementById("jackpot");
const flash = document.getElementById("flash");
const halo = document.getElementById("halo");

const coins = document.getElementById("coins");
const tickets = document.getElementById("tickets");
const particles = document.getElementById("particles");

const sound = document.getElementById("jackpotSound");

// ==========================================
// GOOGLE SHEET
// ==========================================

const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";

// ==========================================
// DECLENCHEMENT
// ==========================================

function launchJackpot(){

    if(jackpotActif) return;

    jackpotActif = true;

    overlay.classList.remove("hide");
    overlay.classList.add("show","pulse");
    animateCasinoTitle();

    halo.classList.add("haloShow");

    flash.classList.add("flash");

    if(sound){

        sound.currentTime = 0;

        sound.play().catch(()=>{});

    }

    createCoins();

    createTickets();

    createParticles();

setTimeout(()=>{

    overlay.classList.remove("show","pulse");

    overlay.classList.add("hide");


    halo.classList.remove("haloShow");


    flash.classList.remove("flash");


    coins.innerHTML="";

    tickets.innerHTML="";

    particles.innerHTML="";


    jackpotActif=false;


},7500);


} // <-- IMPORTANT : fermeture launchJackpot



function animateCasinoTitle(){


    title.classList.remove("lit");

    subtitle.classList.remove("lit");


    let letters =
    title.querySelectorAll("span");


    letters.forEach((letter,index)=>{


        setTimeout(()=>{


            letter.style.opacity="1";


            letter.style.textShadow=
            `
            0 0 20px #FFD700,
            0 0 60px orange,
            0 0 100px gold
            `;


            letter.style.transform=
            "scale(1.15)";


        },index*150);


    });



    setTimeout(()=>{


        subtitle.classList.add("lit");


    },1200);


}
// ==========================================
// PIECES
// ==========================================

function createCoins(){

    coins.innerHTML="";


    for(let i=0;i<80;i++){


        const coin=document.createElement("div");


        coin.className="coin";


        coin.innerHTML="🪙";


        coin.style.left =
        Math.random()*1920 + "px";


        coin.style.top =
        (-100 - Math.random()*500) + "px";


        coin.style.animationDuration =
        (3 + Math.random()*3) + "s";


        coin.style.animationDelay =
        Math.random()*2 + "s";


        coin.style.fontSize =
        (25 + Math.random()*40) + "px";


        coins.appendChild(coin);


    }

}

// ==========================================
// GOLDEN TICKETS
// ==========================================

function createTickets(){

    tickets.innerHTML="";

    for(let i=0;i<20;i++){

        const ticket=document.createElement("div");

        ticket.className="ticket";

        ticket.innerHTML="🎟";

        ticket.style.top=
        (100+Math.random()*700)+"px";

        ticket.style.animationDuration=
        (4+Math.random()*2)+"s";

        ticket.style.animationDelay=
        (Math.random()*2)+"s";

        tickets.appendChild(ticket);

    }

}

// ==========================================
// ETINCELLES
// ==========================================

function createParticles(){

    particles.innerHTML="";

    for(let i=0;i<120;i++){

        const spark=document.createElement("div");

        spark.className="spark";

        spark.style.left=
        (850+Math.random()*250)+"px";

        spark.style.top=
        (180+Math.random()*180)+"px";

        spark.style.animationDuration=
        (1+Math.random()*2)+"s";

        spark.style.animationDelay=
        (Math.random()*1.5)+"s";

        particles.appendChild(spark);

    }

}

// ==========================================
// LECTURE SHEET
// ==========================================

async function readSheet(){

    try{

        const response=
        await fetch(sheetURL+"&cache="+Date.now());

        const csv=
        await response.text();

        console.log(csv);

        const valeurs=
        csv.match(/\b[0-5]\b/g);

        if(!valeurs) return;

        const niveau=
        parseInt(valeurs[0]);

        // Déclenche UNIQUEMENT
        // lors du passage vers 5

        if(niveau===5 && dernierNiveau!==5){

            launchJackpot();

        }

        dernierNiveau=niveau;

    }

    catch(e){

        console.log(e);

    }

}

// ==========================================
// INITIALISATION
// ==========================================

readSheet();

setInterval(readSheet,3000);
