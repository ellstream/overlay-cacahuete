let jetonsActuels = -1;


const vault = document.getElementById("vault");
const fill = document.getElementById("fill");
const compteur = document.getElementById("compteur");
const etat = document.getElementById("etat");



const sheetURL =

"https://docs.google.com/spreadsheets/d/e/2PACX-1vRzMx8EveEFg84HJSOU5IempyqWc4sshrrzocmTAKNf5yNY8ihEqCnJ4vtyyujEsvRPNN3Uv_uUTzAF/pub?output=csv";





function updateVault(value){


    jetonsActuels = value;


    compteur.textContent =
    value + " / 5";



    fill.style.width =
    (value * 20) + "%";



    vault.classList.remove(
        "casino",
        "interdit",
        "jackpot"
    );



    if(value <= 2){


        vault.classList.add("casino");

        etat.textContent="CASINO";


    }


    else if(value < 5){


        vault.classList.add("interdit");

        etat.textContent="SALLE INTERDITE";


    }


    else{


        vault.classList.add("jackpot");

        etat.textContent="JACKPOT";


        setTimeout(()=>{


            vault.classList.remove("jackpot");

            vault.classList.add("interdit");

            etat.textContent="SALLE INTERDITE";


        },5000);



    }


}







async function readSheet(){


try{


    const response = await fetch(
        sheetURL + "&cache=" + Date.now()
    );


    const csv = await response.text();



    console.log("Google Sheet :",csv);



    /*
       Cherche uniquement une valeur
       entre 0 et 5
    */


    const valeurs =
    csv.match(/\b[0-5]\b/g);



    if(!valeurs){

        console.log("Aucun jeton trouvé");

        return;

    }



    const value =
    parseInt(valeurs[0]);



    if(value !== jetonsActuels){

        updateVault(value);

    }


}



catch(error){


console.error(
"Erreur Google Sheet :",
error
);


}



}





setInterval(
readSheet,
3000
);



readSheet();
