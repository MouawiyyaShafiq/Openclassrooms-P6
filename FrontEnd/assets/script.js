
//Fonction qui récupère les données depuis l'API

async function recupWorks (){

    const reponse = await fetch ("http://localhost:5678/api/works");
    const works = await reponse.json();
    return works
    
}

//Fonction qui affiche les works dans la gallery

async function afficherWorks (){

    let works = await recupWorks ()
    let gallery = document.querySelector(".gallery");

    for ( let i=0 ; i < works.length ; i++) {
        
        let figure = document.createElement("figure")
        
        let img = document.createElement("img")
        img.src = works[i].imageUrl
        img.alt = works[i].title
        figure.appendChild(img)

        let figcaption = document.createElement("figcaption")
        figcaption.innerText =works[i].title
        figure.appendChild(figcaption)

        gallery.appendChild(figure)

    }
    
     
}

afficherWorks()




