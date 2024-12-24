
//Fonction qui récupère les works depuis l'API

async function recupWorks (){

    const reponse = await fetch ("http://localhost:5678/api/works");
    const works = await reponse.json();
    return works
    
}

//Fonction qui récupère les categories depuis l'API

async function recupCategorie (){

    const reponse = await fetch ("http://localhost:5678/api/categories");
    const categorie = await reponse.json();
    return categorie
    
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

//Fonction qui affiche les boutons dans le menu filtre

async function creationMenuFiltre () {
    let categorie = await recupCategorie ()
    let filtres = document.querySelector(".filtres");

    let label = document.createElement("label")
    label.classList.add("button")
        
    let input = document.createElement("input")
    input.type= "radio"
    input.name= "categorie"
    input.value = "Tous"
    label.appendChild(input)

    let div = document.createElement("div")
    div.innerHTML="Tous"
    label.appendChild(div)

    filtres.appendChild(label)

    for ( let i=0 ; i < categorie.length ; i++) {
        
        let label = document.createElement("label")
        label.classList.add("button")
        
        let input = document.createElement("input")
        input.type= "radio"
        input.name= "categorie"
        input.value = `${categorie[i].name}`
        label.appendChild(input)

        let div = document.createElement("div")
        div.innerHTML=categorie[i].name
        label.appendChild(div)

        filtres.appendChild(label)

    }
}

creationMenuFiltre ()

afficherWorks()




