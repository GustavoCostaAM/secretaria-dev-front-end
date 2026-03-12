//funcao para pegar o parametro code da path
function getCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("code")
}

//pega elementos do front
const newPasswordInput = window.document.querySelector("#inputNewPassword")
const confirmPasswordInput = window.document.querySelector("#inputConfirmPassword")
const submitButton = window.document.querySelector("#submitButton")

//adiciona event listener para o botão de submit
submitButton.addEventListener("click", (event) => {
    event.preventDefault() //impede que o formulário seja enviado de forma tradicional

    const newPassword = newPasswordInput.value
    const confirmPassword = confirmPasswordInput.value

    //valida se as senhas coincidem
    if (newPassword !== confirmPassword) {
        window.alert("As senhas não coincidem. Por favor, tente novamente.")
        return
    }

    //pega o código de recuperação da URL
    const code = getCodeFromURL()

    //faz a requisição para a API de recuperação de senha
    fetch(getUpdatePasswordURL(code), {
        method: "POST",
        body: JSON.stringify({ password: newPassword, code: code}),
        headers: {"Content-Type": "application/json"}
    }).then(response => {
        if (response.ok) {
            window.location.href = "login.html" //redireciona para a página de login após sucesso
        } else {
            window.alert("Erro ao atualizar senha. O código de recuperação pode ser inválido ou expirado.")
            window.location.href = "recuperacao-email.html" //redireciona para o inicio do fluxo de recuperação
        }
    })
})