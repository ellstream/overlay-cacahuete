let jetonsActuels = -1;

const jauge = document.getElementById("jauge");
const barre = document.getElementById("barre");
const compteur = document.getElementById("compteur");


// GOOGLE SHEET CSV

const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";



function changerJauge(valeur){


    jetonsActuels = valeur;


    compteur.textContent =
    valeur + " / 5";


    barre.style.width =
    ((valeur / 5) * 100) + "%";



    jauge.classList.remove(
        "casino",
        "interdit",
        "jackpot"
    );



    if(valeur <= 2){

        jauge.classList.add("casino");

    }


    else if(valeur < 5){

        jauge.classList.add("interdit");

    }


    else {


        jauge.classList.add("jackpot");


        setTimeout(()=>{


            jauge.classList.remove("jackpot");

            jauge.classList.add("interdit");


        },5000);


    }

}




async function lireGoogleSheet(){


    try{


        const response =
        await fetch(
            sheetURL + "&cache=" + Date.now()
        );


        const data =
        await response.text();



        const resultat =
        data.match(/\d+/);



        if(!resultat){

            console.log(
            "Pas de valeur trouvée"
            );

            return;

        }



        const valeur =
        parseInt(resultat[0]);



        if(valeur !== jetonsActuels){

            changerJauge(valeur);

        }


    }


    catch(error){


        console.error(
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
