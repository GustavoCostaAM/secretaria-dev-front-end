//seta elementos do input
inputName = document.querySelector("#nome")
inputUserName = document.querySelector("#username")
inputEmail = document.querySelector("#email")
inputPassword = document.querySelector("#password")

//seta o botão de submit
submitButton = document.querySelector("#submit")

//adiciona evento de click ao botão de submit
submitButton.addEventListener("click", async function(event) {
    event.preventDefault() //previne o envio de formulario tradicional

    //cria um objeto com os dados do formulário
    const userData = {
        name: inputName.value,
        username: inputUserName.value,
        email: inputEmail.value,
        password: inputPassword.value,
        role: "STUDENT"
    }

    //envia os dados para o backend
    const response = await fetch(getSingUpURL(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })

    //caso de sucesso na api
    if (response.ok){
        //pega o token retornado pela api
            const token = await response.json().token

        //salva o token no localStorage
        localStorage.setItem("token", token)

        window.location.href = "crud-base.html" //pagina principal do nosso crud
    }
})