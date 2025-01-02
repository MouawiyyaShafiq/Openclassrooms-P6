
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
    gallery.innerHTML = ""

    for ( let i=0 ; i < works.length ; i++) {
        
        const figure = document.createElement("figure")
        figure.id = `galleryFigure${works[i].id}`
        
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

        manageModaldisplay ()


    }
}

//Fonction qui gère la fermeture et ouverture des modaux

function manageModaldisplay () {

    const modal1 = document.querySelector("#modal_1")
    const modal2 = document.querySelector("#modal_2")
    
    document.querySelector(".modal1Button").addEventListener("click", async function(){

        modal1.setAttribute("style","display: flex")
        await loadWorksAndCatgoriesInModal()
        delWork ()
        modal1.addEventListener("click" , function(){
            modal1.setAttribute("style","display: none")
        })
    })

    document.querySelector(".modal2Button").addEventListener("click", function(){

        modal2.setAttribute("style","display: flex")
        addWork ()
        modal2.addEventListener("click" , function(){

            resetForm ()
            modal1.setAttribute("style","display: none")
            modal2.setAttribute("style","display: none")
            
            
        })

    })

    document.querySelectorAll(".closeModal").forEach(button => {

        button.addEventListener("click", function(){

            resetForm ()
            modal1.setAttribute("style","display: none")
            modal2.setAttribute("style","display: none")
            
        })
    })

    document.querySelector(".closeModal2").addEventListener("click", async function(){
        
        resetForm ()
        await loadWorksAndCatgoriesInModal()
        delWork ()
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
    divImages.innerHTML = ""

    for (let i=0 ; i < works.length ; i++) {

        divImages.innerHTML += `<figure><img src="${works[i].imageUrl}"><span class="delButton" id="${works[i].id}"><i class="fa-solid fa-trash-can"></i></span></figure>`

    }

    const selectCategorie = document.getElementById("categorie")
    selectCategorie.innerHTML = '<option value="" selected></option>'
    
    for (let i=0 ; i < categorie.length ; i++) {

        selectCategorie.innerHTML += `<option id="${categorie[i].id}">${categorie[i].name}</option>`

    }
    
}

// Fonction permettant l'envoi d’un nouveau projet au back-end via le formulaire de la modale

async function addWork () {

    const addWorkForm = document.getElementById("addWorkForm")

    const imgInput = document.getElementById("file-input")
    const titleInput = document.getElementById("titre")
    const categorieInput = document.getElementById ("categorie")

    const defaultDisplay = document.querySelector(".defaultDisplay")
    const preveiwImg = document.querySelector(".previewImg")

    imgInput.addEventListener("change", function () {
        const previewImgFile = imgInput.files[0]

        if(previewImgFile){

            defaultDisplay.setAttribute("style","display: none")
            preveiwImg.setAttribute("style","display: block")

            const reader = new FileReader()
            reader.readAsDataURL(previewImgFile)

            reader.addEventListener("load", function(){
                preveiwImg.src = reader.result
            })
        }
        
    })

    addWorkForm.addEventListener("submit", async function(event){

        event.preventDefault()

        const previewImgFile = imgInput.files[0]

        if(!previewImgFile){

            let errorbox = document.getElementById("errorBoxModal2")

            if (!errorbox) {
                errorbox = document.createElement("div")
                errorbox.id = "errorBoxModal2"
                errorbox.innerText = "Veuillez sélectionner une image avant de valider."
                document.getElementById("modal_2").prepend(errorbox)
            } else {
                errorbox.innerText = "Veuillez sélectionner une image avant de valider."
            }

        } else {

            const token = sessionStorage.getItem("authToken")

            const selectedoption = categorieInput.options[categorieInput.selectedIndex]

            const DataofWorkToAdd = new FormData()
            DataofWorkToAdd.append("image",imgInput.files[0])
            DataofWorkToAdd.append("title",titleInput.value)
            DataofWorkToAdd.append("category",selectedoption.id)

            resetForm ()

            try {

                const response = await fetch("http://localhost:5678/api/works",{

                method : "POST",
                headers : {"Authorization": "Bearer " + token},
                body : DataofWorkToAdd

                })

                if (response.status ==! 201){

                    throw new Error()
    
                } else {

                    let errorbox = document.getElementById("errorBoxModal2")

                    if (errorbox) {
                        errorbox.remove()
                    } 

                    const works = await recoverWorks ()
                    displayWorks(works)
                     
                }

            } catch {
                let errorbox = document.getElementById("errorBoxModal2")

                if (!errorbox) {
                    errorbox = document.createElement("div")
                    errorbox.id = "errorBoxModal2"
                    errorbox.innerText = "Erreur d'envoi veuillez vérifier le format de l'image."
                    document.getElementById("modal_2").prepend(errorbox)
                } else {
                    errorbox.innerText = "Erreur d'envoi veuillez vérifier le format de l'image."
                }

            }
            
        }
     
    })

}

// Fonction permettant la suppression d’un projet au back-end

async function delWork () {

    const spanDelButton = document.querySelectorAll(".delButton")
    
    for( let i=0 ; i < spanDelButton.length ; i++){

       spanDelButton[i].addEventListener("click", async function(event){

        const token = sessionStorage.getItem("authToken")

        try {

            const response = await fetch (`http://localhost:5678/api/works/${this.id}`,{
                method : "DELETE",
                headers : {"Authorization": "Bearer " + token},
            })

            if (response.status ==! 204){

                throw new Error()

            } else {

                let errorbox = document.getElementById("errorBoxModal1")

                    if (errorbox) {
                        errorbox.remove()
                    } 

                const parentFigure = spanDelButton[i].parentNode
                parentFigure.remove()

                const workInGallery = document.getElementById(`galleryFigure${this.id}`)
                workInGallery.remove()

            }

        } catch {

            let errorbox = document.getElementById("errorBoxModal1")

            if (!errorbox) {
                errorbox = document.createElement("div")
                errorbox.id = "errorBoxModal1"
                errorbox.innerText = "Echec de la suppression veuillez réessayer."
                document.getElementById("modal_1").prepend(errorbox)
            }

        }

        
       })

    }

}

function resetForm () {

    const addWorkForm = document.getElementById("addWorkForm")

    const defaultDisplay = document.querySelector(".defaultDisplay")
    const preveiwImg = document.querySelector(".previewImg")

    addWorkForm.reset()
    defaultDisplay.setAttribute("style","display: flex")
    preveiwImg.setAttribute("style","display: none")

    let errorbox = document.getElementById("errorBoxModal1")

        if (errorbox) {
            errorbox.remove()
        } 

    let errorbox2 = document.getElementById("errorBoxModal2")

        if (errorbox2) {
            errorbox2.remove()
        } 

}


await loadPage ()








