//seta elementos do input
inputName = document.querySelector("#nome")
inputUserName = document.querySelector("#username")
inputEmail = document.querySelector("#email")
inputPassword = document.querySelector("#password")
inputEnrollment = document.querySelector("#enrollment")

//seta o botão de submit
submitButton = document.querySelector("#submit")

//adiciona evento de click ao botão de submit
submitButton.addEventListener("click", async function(event) {
    event.preventDefault() //previne o envio de formulario tradicional

    //cria um objeto com os dados do formulário
    const userData = {
        enrollmentCode: inputEnrollment.value,
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
        showUpdatePopup("success", "Cadastro realizado com sucesso.")
        window.location.href = "login.html" //pagina de login
    }else{
        showUpdatePopup("error", "Erro ao fazer cadastro, tente novamente.")
        window.location.reload() 
    }
})