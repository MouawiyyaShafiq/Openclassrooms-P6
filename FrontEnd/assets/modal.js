import {recoverWorks ,recoverCategorie, displayWorks} from "./script.js"

//Fonction qui gère la fermeture et ouverture des modaux

export function manageModaldisplay () {

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

    const modal2FormDiv = document.querySelector(".modal_2 form > div")
    let selectCategorie = document.getElementById("categorie")
    let labelSelectCategorie = document.getElementById("labelCategorie")

    if(!selectCategorie || !labelSelectCategorie){

        modal2FormDiv.innerHTML += 
        `<label id="labelCategorie" for="categorie">Catégorie</label>
        <select id="categorie" name="categorie" ></select>`
        
        selectCategorie = document.getElementById("categorie")
        selectCategorie.innerHTML = '<option value="" selected></option>'
            
        for (let i=0 ; i < categorie.length ; i++) {

            selectCategorie.innerHTML += `<option id="${categorie[i].id}">${categorie[i].name}</option>`

        }
            
    } else {

        selectCategorie.innerHTML = '<option value="" selected></option>'

        for (let i=0 ; i < categorie.length ; i++) {

            
            selectCategorie.innerHTML += `<option id="${categorie[i].id}">${categorie[i].name}</option>`

        }
            
    }
    
}

// Fonction permettant l'envoi d’un nouveau projet au back-end via le formulaire de la modale

async function addWork () {

    const addWorkForm = document.getElementById("addWorkForm")

    const imgInput = document.getElementById("file-input")
    const titleInput = document.getElementById("titre")
    const categorieInput = document.getElementById ("categorie")

    const defaultDisplayDiv = document.querySelector(".defaultDisplay div")
    const preveiwImgLabel = document.getElementById("file-label")

    const submitButton = document.getElementById("valider")

    addWorkForm.addEventListener("change", function () {

        submitButton.removeAttribute("disabled","")
        const previewImgFile = imgInput.files[0]
        const selectedoption = categorieInput.options[categorieInput.selectedIndex]

        if(previewImgFile){

            defaultDisplayDiv.setAttribute("style","display: none")
            
            const reader = new FileReader()
            reader.readAsDataURL(previewImgFile)

            reader.addEventListener("load", function(){
                preveiwImgLabel.innerHTML = `<img src="${reader.result}" alt="Preview Image" class="previewImg"></img>`
            })
        }

        if (previewImgFile && titleInput.value && selectedoption.id) {

            submitButton.setAttribute("style","null")
        } else {

            submitButton.setAttribute("style","background-color:#A7A7A7;")
        }

        
    })

    addWorkForm.addEventListener("submit", async function(event){

        event.preventDefault()

        const previewImgFile = imgInput.files[0]
        const selectedoption = categorieInput.options[categorieInput.selectedIndex]


        if (!previewImgFile || !titleInput.value || !selectedoption.id) {

            let errorbox = document.getElementById("errorBoxModal2")

                if (!errorbox) {
                    errorbox = document.createElement("div")
                    errorbox.id = "errorBoxModal2"
                    errorbox.innerText = "Merci de remplir intégralement le formulaire avant l'envoi"
                    document.getElementById("modal_2").prepend(errorbox)
                } else {
                    errorbox.innerText = "Merci de remplir intégralement le formulaire avant l'envoi"
                }
            
        } else {

            const token = sessionStorage.getItem("authToken")


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

                if (response.status != 201){

                    throw new Error()
        
                } else {

                    let errorbox = document.getElementById("errorBoxModal2")

                    if (errorbox) {
                        errorbox.remove()
                    } 
                        
                    document.querySelector("#modal_1").setAttribute("style","display: none")
                    document.querySelector("#modal_2").setAttribute("style","display: none")
                        
                    submitButton.setAttribute("disabled","")

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

            if (response.status != 204){

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

    const defaultDisplayDiv = document.querySelector(".defaultDisplay div")
    const preveiwImgLabel = document.getElementById("file-label")

    addWorkForm.reset()
    defaultDisplayDiv.setAttribute("style","display: flex")
    preveiwImgLabel.innerHTML=""

    let errorbox = document.getElementById("errorBoxModal1")

        if (errorbox) {
            errorbox.remove()
        } 

    let errorbox2 = document.getElementById("errorBoxModal2")

        if (errorbox2) {
            errorbox2.remove()
        } 

}