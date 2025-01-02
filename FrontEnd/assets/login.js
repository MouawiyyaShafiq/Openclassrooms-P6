//Fonction qui permet de générer l'errorBox

function loadErrorBox () {
    let errorbox = document.getElementById("errorBox")

            if (!errorbox) {
                errorbox = document.createElement("div")
                errorbox.id = "errorBox"
                errorbox.innerText = "E-mail ou mot de passe incorrect veuillez ressayer."
                document.getElementById("loginFrom").prepend(errorbox)
            }
}

//Fonction qui traite le formulaire de login utilisateur

async function loginUser () {

    const form = document.getElementById("loginFrom")
    
    form.addEventListener("submit", async function(event) {
        event.preventDefault()

        let username = document.getElementById("email");
        let password = document.getElementById("password");

        let loginData = {
            "email": `${username.value}`,
            "password": `${password.value}`
        }

        loginData = JSON.stringify(loginData)

        username.value = ""
        password.value = ""

        try {
            
            const response = await fetch ("http://localhost:5678/api/users/login",{
                method : "POST",
                headers : {"Content-Type": "application/json"},
                body : loginData
            })


            if (response.status != 200){

                throw new Error()

            } else {

                const user = await response.json()
                const token = user.token

                sessionStorage.setItem("authToken", token)

                window.location.href = "./index.html";

            }

        } catch {
            
            loadErrorBox ()
            
        }

    })
   
}

sessionStorage.removeItem("authToken")

loginUser ()




