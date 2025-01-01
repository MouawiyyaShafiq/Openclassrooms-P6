
//Fonction qui récupère les works depuis l'API

async function recoverWorks (){

    const response = await fetch ("http://localhost:5678/api/works");
    const works = await response.json();
    return works
    
}

//Fonction qui récupère les categories depuis l'API

async function recoverCategorie (){

    const response = await fetch ("http://localhost:5678/api/categories");
    const categorie = await response.json();
    return categorie
    
}


//Fonction qui affiche les works dans la gallery

async function displayWorks (works){

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

async function creatFilterMenu () {
    const categorie = await recoverCategorie ()
    const filters = document.querySelector(".filters");

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

    filters.appendChild(label)

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

        filters.appendChild(label)

    }
}

//Fonction qui permet d'appliquer le filtre sélectionné

async function filtreWorks() {

    const works = await recoverWorks ()

    const filterInput = document.querySelectorAll('[name="categorie"]')

    for( let i=0 ; i<filterInput.length ; i++){

        filterInput[i].addEventListener("change", function (event) {


            const worksFiltered = works.filter(function(work){

                if (event.target.id == 0) {
                    return work.categoryId != event.target.id
                } else {
                    return work.categoryId == event.target.id
                }     
            })

            const gallery = document.querySelector(".gallery")
            gallery.innerHTML = ""
            displayWorks(worksFiltered)
        })
    }

}

async function loadPage() {
    
    const token = sessionStorage.getItem("authToken")
    const works = await recoverWorks ()
    displayWorks(works)

    if(!token) { 
        
        creatFilterMenu ()
        filtreWorks()
        
    }else{

        const divModified = document.createElement("div")
        divModified.classList.add("headerModified")
        divModified.innerHTML = "<p><i class=\"fa-regular fa-pen-to-square\"></i> Mode édition</p>"

        document.body.prepend(divModified)

        const portfolioHeader = document.querySelector("#portfolio h2")
        portfolioHeader.innerHTML = "Mes Projets<button class=\"modal1Button\"><i class=\"fa-regular fa-pen-to-square\"></i><span> modifier</span></button>"

    }
}

//Fonction qui gère la fermeture et ouverture des modaux

function manageModaldisplay () {

    const modal1 = document.querySelector("#modal_1")
    const modal2 = document.querySelector("#modal_2")
    
    document.querySelector(".modal1Button").addEventListener("click", function(){

        modal1.setAttribute("style","display: null")
        modal1.addEventListener("click" , function(){
            modal1.setAttribute("style","display: none")
        })
    })

    document.querySelector(".modal2Button").addEventListener("click", function(){

        modal2.setAttribute("style","display: null")
        modal2.addEventListener("click" , function(){

            modal1.setAttribute("style","display: none")
            modal2.setAttribute("style","display: none")
            
        })

    })

    document.querySelectorAll(".closeModal").forEach(button => {

        button.addEventListener("click", function(){

            modal1.setAttribute("style","display: none")
            modal2.setAttribute("style","display: none")
    
        })
    })

    document.querySelector(".closeModal2").addEventListener("click", function(){

        modal2.setAttribute("style","display: none")
    
    })
    
    document.querySelectorAll(".containerModal").forEach(container => {
        container.addEventListener("click" , function (event) { event.stopPropagation()})
    })

}

//Fonction permettant l'affichage dynamique des images et catégorie dans les modaux

async function loadWorksAndCatgoriesInModal() {

    const works = await recoverWorks ()
    const categorie = await recoverCategorie ()

    const divImages = document.querySelector(".images")

    for (let i=0 ; i < works.length ; i++) {

        divImages.innerHTML += `<figure><img src="${works[i].imageUrl}"><span id="${works[i].id}"><i class="fa-solid fa-trash-can"></i></span></figure>`

    }

    const selectCategorie = document.getElementById("categorie")
    
    for (let i=0 ; i < categorie.length ; i++) {

        selectCategorie.innerHTML += `<option id="${categorie[i].id}">${categorie[i].name}</option>`

    }
    
}


await loadPage ()

manageModaldisplay ()

loadWorksAndCatgoriesInModal()






