//verifica se o token existe
if (localStorage.getItem("token")) {
    window.location.href = "aluno.html"
}

//carrega elementos do formulario
const inputUsername = document.querySelector("#username")
const inputPassword = document.querySelector("#password")
const form = document.querySelector("#form")

//adiciona event listener para o submit do formulario
form.addEventListener("click", async function (event) {
    event.preventDefault() //previne a mudança de rota do usuario

    //faz a requisição para o backend
    const loginData = {
        username: inputUsername.value,
        password: inputPassword.value
    }

    const response = await fetch(getLoginURL(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })

    if (response.ok) {
        //caso de sucesso, pega o token retornado pela api
        const data = await response.json()
        const token = data.token

        console.log(token)

        //guarda o token no local storage
        localStorage.setItem("token", token)

        //leva para o fluxo correto de acordo com a role

        if (data.role === "ADM") {
            window.location.href = "admin.html"
        }else if(data.role === "TEACHER"){
            //salva o subject do professor no localStorage para usar na tela de professor
            localStorage.setItem("subject", data.subject)

            window.location.href = "professor.html"
        }else{
            window.location.href = "aluno.html"
        }

    }else {
        alert("Erro ao fazer login, tente novamente.")
        window.location.reload() //recarrega a página para limpar os campos
    }
})
