function genererErrorBox () {
    let errorbox = document.getElementById("errorBox")

            if (!errorbox) {
                errorbox = document.createElement("div")
                errorbox.id = "errorBox"
                errorbox.innerText = "E-mail ou mot de passe incorrect veuillez ressayer."
                document.getElementById("loginFrom").prepend(errorbox)
            }
}


async function loginUser () {

    const form = document.getElementById("loginFrom")
    
    form.addEventListener("submit", async function(event) {
        event.preventDefault()
        
        let username = document.getElementById("email");
        let password = document.getElementById("motdepasse");

        const donneelogin = {
            "email": `${username.value}`,
            "password": `${password.value}`
        }

        const chargeUtile = JSON.stringify(donneelogin)

        username.value = ""
        password.value = ""

        try {
            
            const reponse = await fetch ("http://localhost:5678/api/users/login",{
                method : "POST",
                headers : {"Content-Type": "application/json"},
                body : chargeUtile
            })

            if (reponse.status != 200){

                throw new Error()

            } else {

                const user = await reponse.json()
                const token = user.token

                sessionStorage.setItem("authToken", token)
            }

        } catch {
            
            genererErrorBox ()
            
        }

    })
   
}

loginUser ()




