async function loginUser () {

    const form = document.getElementById("loginFrom")

    form.addEventListener("submit", async function(event) {
        event.preventDefault()

        const username = document.getElementById("email").value;
        const password = document.getElementById("motdepasse").value;
        const donneelogin = {
            "email": `${username}`,
            "password": `${password}`
          }
        const chargeUtile = JSON.stringify(donneelogin)

        const reponse = await fetch ("http://localhost:5678/api/users/login",{
            method : "POST",
            headers : {"Content-Type": "application/json"},
            body : chargeUtile
        })

        const user = await reponse.json()

        console.log(user.token)

    })

}

loginUser ()