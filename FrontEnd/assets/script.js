
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

async function afficherWorks (works){

    const gallery = document.querySelector(".gallery");

    for ( let i=0 ; i < works.length ; i++) {
        
        const figure = document.createElement("figure")
        
        const img = document.createElement("img")
        img.src = works[i].imageUrl
        img.alt = works[i].title
        figure.appendChild(img)

        const figcaption = document.createElement("figcaption")
        figcaption.innerText =works[i].title
        figure.appendChild(figcaption)

        gallery.appendChild(figure)

    }
    
     
}

//Fonction qui affiche les boutons dans le menu filtre

async function creationMenuFiltre () {
    const categorie = await recupCategorie ()
    const filtres = document.querySelector(".filtres");

    const label = document.createElement("label")
    label.classList.add("button")
        
    const input = document.createElement("input")
    input.type= "radio"
    input.name= "categorie"
    input.value = "Tous"
    input.id = "0"
    input.checked = true
    label.appendChild(input)

    const div = document.createElement("div")
    div.innerHTML="Tous"
    label.appendChild(div)

    filtres.appendChild(label)

    for ( let i=0 ; i < categorie.length ; i++) {
        
        const label = document.createElement("label")
        label.classList.add("button")
        
        const input = document.createElement("input")
        input.type= "radio"
        input.name= "categorie"
        input.value = `${categorie[i].name}`
        input.id = categorie[i].id
        label.appendChild(input)

        const div = document.createElement("div")
        div.innerHTML=categorie[i].name
        label.appendChild(div)

        filtres.appendChild(label)

    }
}

//Fonction qui permet d'appliquer le filtre sélectionné

async function filtreWorks() {

    const works = await recupWorks ()

    const filtreInput = document.querySelectorAll('[name="categorie"]')

    for( let i=0 ; i<filtreInput.length ; i++){

        filtreInput[i].addEventListener("change", function (event) {


            const worksFiltree = works.filter(function(work){

                if (event.target.id == 0) {
                    return work.categoryId != event.target.id
                } else {
                    return work.categoryId == event.target.id
                }     
            })

            const gallery = document.querySelector(".gallery")
            gallery.innerHTML = ""
            afficherWorks(worksFiltree)
        })
    }

}

async function genererPage() {
    
    const token = sessionStorage.getItem("authToken")
    const works = await recupWorks ()
    afficherWorks(works)

    if(!token) { 
        
        creationMenuFiltre ()
        filtreWorks()
        
    }else{

        const divModif = document.createElement("div")
        divModif.classList.add("headerModif")
        divModif.innerHTML = "<p><i class=\"fa-regular fa-pen-to-square\"></i> Mode édition</p>"

        document.body.prepend(divModif)

        const portfolioHeader = document.querySelector("#portfolio h2")
        portfolioHeader.innerHTML = "Mes Projets<button class=\"modifier\"><i class=\"fa-regular fa-pen-to-square\"></i><span> modifier</span></button>"

    }
}

genererPage()






