//funcao para pegar o parametro code da path
function getCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("code")
}

//funcao para fluxo de chamada da API para validar se a req é real
function validateRecoveryCode(code) {
    return fetch(getValidateRecoveryCodeURL(code), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            console.log("Código de recuperação inválido ou expirado.")
            window.location.href = "recuperacao-email.html" //redireciona para a página de recuperação de email caso o código seja inválido
        }else{
            return;
        }
    })
}

//chama a função de validação do código ao carregar a página
const code = getCodeFromURL()
if (code) {
    validateRecoveryCode(code)
} else {
    console.log("Código de recuperação não encontrado na URL.")
    window.location.href = "recuperacao-email.html"
}