//carrega os elementos html para adicionar event listener
const emailInput = window.document.querySelector("#inputEmail")
const submitButton = window.document.querySelector("#submitButton")

//adiciona event listener para o submit button
submitButton.addEventListener("click", (event) => {
    //evita o comportamento padrão do formulário (recarregar a página)
    event.preventDefault()

    //pega o valor do email
    const email = emailInput.value
    if (email) {
        fetch(getRecoveryMailURL(), {
            method: "POST",
            body: JSON.stringify({ recipientMail: email }),
            headers:{
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.ok) {
                console.log("Email de recuperação enviado com sucesso.")
                showUpdatePopup("success", "Email de recuperacao enviado com sucesso.")
            } else {
                console.log("Erro ao enviar email de recuperação. Verifique o email e tente novamente.")
                showUpdatePopup("error", "Erro ao enviar email de recuperacao.")
            }
        })
    }
})